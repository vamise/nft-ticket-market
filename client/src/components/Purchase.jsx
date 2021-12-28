import React, { Component } from 'react';
import Web3 from 'web3';
import eventFactory from '../proxies/eventFactory';
import EventNFT from '../proxies/EventNFT';
import EventMarketplace from '../proxies/EventMarketplace';
import eventToken from '../proxies/EventToken';
import renderNotification from '../utils/notification-handler';

let web3;

class Purchase extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateEvents();
  }

  updateEvents = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const activeEvents = await eventFactory.methods.getActiveEvents().call({ from: initiator });
      const fests = await Promise.all(activeFests.map(async fest => {
        const festDetails = await eventFactory.methods.getEventDetails(fest).call({ from: initiator });
        const [festName, festSymbol, ticketPrice, totalSupply, marketplace] = Object.values(festDetails);
        const nftInstance = await EventNFT(fest);
        const saleId = await nftInstance.methods.getNextSaleTicketId().call({ from: initiator });

        return (
          <tr key={fest}>
            <td class="center">{festName}</td>
            <td class="center">{web3.utils.fromWei(ticketPrice, 'ether')}</td>
            <td class="center">{totalSupply - saleId}</td>

            <td class="center"><button type="submit" className="custom-btn login-btn" onClick={this.onPurchaseTicket.bind(this, marketplace, ticketPrice, initiator)}>Buy</button></td>
          </tr>
        );
      }));

      this.setState({ events: fests });
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while updating the fetivals', err);
    }
  }

  onPurchaseTicket = async (marketplace, ticketPrice, initiator) => {
    try {
      const marketplaceInstance = await EventMarketplace(marketplace);
      await eventToken.methods.approve(marketplace, ticketPrice).send({ from: initiator, gas: 6700000 });
      await marketplaceInstance.methods.purchaseTicket().send({ from: initiator, gas: 6700000 });
      await this.updateEvents();

      renderNotification('success', 'Success', `Ticket for the Event purchased successfully!`);
    } catch (err) {
      console.log('Error while creating new event', err);
      renderNotification('danger', 'Error', err.message);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container " class="col s12 m6 offset-m3 l4 offset-l4 z-depth-6 card-panel">
        <h4 class="center">Purchase Tickets</h4>
        <table id='requests' class="responsive-table striped" >
          <thead>
            <tr>
              <th key='name' class="center">Name</th>
              <th key='price' class="center">Price(in EVENT)</th>
              <th key='left' class="center">Tickets Left</th>
              <th key='purchase' class="center">Purchase</th>
            </tr>
          </thead>
          <tbody class="striped highlight">
            {this.state.events}
          </tbody>
        </table>
      </div >
    )
  }
}

export default Purchase;  