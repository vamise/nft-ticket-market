import React, { Component } from 'react';
import Web3 from 'web3';
import eventFactory from '../proxies/EventFactory';
import EventNFT from '../proxies/EventNFT';
import renderNotification from '../utils/notification-handler';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Text
} from '@chakra-ui/react';

let web3;

class MyTickets extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      events: [],
      ticket: null,
      event: null,
      marketplace: null,
      price: null,
      test: null,
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateEvents();
  }

  onListForSale = async (e) => {
    try {
      e.preventDefault();
      const initiator = await web3.eth.getCoinbase();
      const { ticket, price, marketplace } = this.state;
      const nftInstance = await EventNFT(this.state.event);
      await nftInstance.methods.setSaleDetails(ticket, web3.utils.toWei(price, 'ether'), marketplace).send({ from: initiator, gas: 6700000 });

      renderNotification('success', 'Success', `Ticket is listed for sale in secondary market!`);
    } catch (err) {
      console.log('Error while listing for sale', err);
      renderNotification('danger', 'Error', err.message.split(' ').slice(8).join(' '));
    }
  }

  updateEvents = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const activeEvents = await eventFactory.methods.getActiveEvents().call({ from: initiator });
      const eventDetails = await eventFactory.methods.getEventDetails(activeEvents[0]).call({ from: initiator });
      const renderData = await Promise.all(activeEvents.map(async (event, i) => {
        const eventDetails = await eventFactory.methods.getEventDetails(activeEvents[i]).call({ from: initiator });
        return (
          <option key={event} value={event} >{eventDetails[0]}</option>
        )
      }));

      this.setState({ events: renderData, event: activeEvents[0], marketplace: eventDetails[4] });
      this.updateTickets();
      console.log('state events:', renderData);
    } catch (err) {
      renderNotification('danger', 'Error', 'Error while updating the events');
      console.log('Error while updating the events', err);
    }
  }

  updateTickets = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const nftInstance = await EventNFT(this.state.event);
      const tickets = await nftInstance.methods.getTicketsOfCustomer(initiator).call({ from: initiator });
      const renderData = tickets.map((ticket, i) => (
        <option key={ticket} value={ticket} >{ticket}</option>
      ));

      this.setState({ tickets: renderData, ticket: tickets[0] });
      console.log('state tickets:', renderData);
    } catch (err) {
      renderNotification('danger', 'Error', 'Error in updating the ticket for events');
      console.log('Error in updating the ticket', err);
    }
  }

  onEventChangeHandler = async (e) => {
    try {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);

      const { event } = this.state;
      await this.updateTickets(event);

      const initiator = await web3.eth.getCoinbase();
      const eventDetails = await eventFactory.methods.getEventDetails(event).call({ from: initiator });

      this.setState({ marketplace: eventDetails[4] });
    } catch (err) {
      console.log('Error while tickets for event', err.message);
      renderNotification('danger', 'Error', 'Error while tickets for event');
    }
  }

  selectHandler = (e) => {
    this.setState({ ticket: e.target.value });
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
        <div class="container">
          <Text fontSize='4xl' style={{ padding: "30px 0px 0px 10px" }}>My Tickets</Text>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Event</Th>
                <Th>Ticket ID</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Demo Account(Placeholder)</Td>
                <Td>dk39s9832093kx</Td>
                <Td>-></Td>
              </Tr>
            </Tbody>
          </Table>
          <form class="" onSubmit={this.onListForSale}>

            <label class="left">Events</label>
            <select className="browser-default" name='event' value={this.state.event || undefined} onChange={this.onEventChangeHandler}>
              <option value="" disabled >Select Event</option>
              {this.state.events}
            </select><br /><br />

            <label class="left">Ticket Id</label>
            <select className="browser-default" name='ticket' value={this.state.ticket || undefined} onChange={this.selectHandler}>
              <option value="" disabled>Select Ticket</option>
              {this.state.tickets}
            </select><br /><br />

            <label class="left">Sale Price</label><input id="price" placeholder="Sale Price" type="text" className="input-control" name="price" onChange={this.inputChangedHandler} /><br /><br />

            <button type="submit" className="custom-btn login-btn">List for Sale</button>
          </form>
        </div>
      </div >
    )
  }
}

export default MyTickets;