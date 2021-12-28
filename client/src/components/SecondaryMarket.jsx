import React, { Component } from 'react';
import Web3 from 'web3';
import eventFactory from '../proxies/eventFactory';
import EventNFT from '../proxies/EventNFT';
import EventMarketplace from '../proxies/EventMarketplace';
import eventToken from '../proxies/EventToken';
import renderNotification from '../utils/notification-handler';

let web3;

class SecondaryMarket extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      events: [],
      ticket: null,
      event: null,
      marketplace: null,
      price: null,
      renderTickets: [],
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateEvents();
    if (this.state.event) {
      await this.updateTickets()
    }
  }

  updateTickets = async () => {
    try {
      const { event } = this.state;
      const initiator = await web3.eth.getCoinbase();
      const nftInstance = await EventNFT(this.state.event);
      const saleTickets = await nftInstance.methods.getTicketsForSale().call({ from: initiator });
      const renderData = await Promise.all(saleTickets.map(async ticketId => {
        const { purchasePrice, sellingPrice, forSale } = await nftInstance.methods.getTicketDetails(ticketId).call({ from: initiator });

        const eventDetails = await eventFactory.methods.getEventDetails(event).call({ from: initiator });
        const [eventName] = Object.values(eventDetails);

        if (forSale) {
          return (
            <tr key={ticketId}>
              <td class="center">{eventName}</td>
              <td class="center">{ticketId}</td>
              <td class="center">{web3.utils.fromWei(sellingPrice, 'ether')}</td>

              <td class="center"><button type="submit" className="custom-btn login-btn" onClick={this.onPurchaseTicket.bind(this, ticketId, sellingPrice, initiator)}>Buy</button></td>
            </tr>
          );
        }
      }));

      this.setState({ renderTickets: renderData });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error wile updating sale tickets');
      console.log('Error wile updating sale tickets', err);
    }
  }

  onPurchaseTicket = async (ticketId, sellingPrice, initiator) => {
    try {
      const { marketplace } = this.state;
      const marketplaceInstance = await EventMarketplace(marketplace);
      await eventToken.methods.approve(marketplace, sellingPrice).send({ from: initiator, gas: 6700000 });
      await marketplaceInstance.methods.secondaryPurchase(ticketId).send({ from: initiator, gas: 6700000 });
      await this.updateTickets()

      renderNotification('success', 'Success', 'Ticket purchased for the event successfully!');
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while purchasing the ticket', err);
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

      this.setState({ events: renderData, event: activeEvents[0], marketplace: eventDetails[4], eventName: eventDetails[0] });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error while updating the events');
      console.log('Error while updating the events', err);
    }
  }

  onEventChangeHandler = async (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);

    const { event } = this.state;
    const initiator = await web3.eth.getCoinbase();
    const eventDetails = await eventFactory.methods.getEventDetails(event).call({ from: initiator });

    this.setState({ marketplace: eventDetails[4] });
    await this.updateTickets();
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    console.log('input', e.target.name, e.target.value)
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
        <div class="row">
          <div class="container ">
            <div class="container ">

              <h5 style={{ padding: "30px 0px 0px 10px" }}>Secondary Marketplace</h5>

              <label class="left">Event</label>
              <select className="browser-default" name='event' value={this.state.event || undefined} onChange={this.onEventChangeHandler}>
                <option value="" disabled >Select Event</option>
                {this.state.events}
              </select><br /><br />

              <h4 class="center">Purchase Tickets</h4>

              <table id='requests' class="responsive-table striped" >
                <thead>
                  <tr>
                    <th key='name' class="center">Event Name</th>
                    <th key='ticketId' class="center">Ticket Id</th>
                    <th key='cost' class="center">Cost(in EVENT)</th>
                    <th key='purchase' class="center">Purchase</th>
                  </tr>
                </thead>
                <tbody class="striped highlight">
                  {this.state.renderTickets}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default SecondaryMarket;