import React, { Component } from 'react';
import Web3 from 'web3';
import eventFactory from '../proxies/eventFactory';
import eventToken from '../proxies/EventToken';
import EventNFT from '../proxies/EventNFT';
import renderNotification from '../utils/notification-handler';
import { Input, Button, Text } from '@chakra-ui/react'

let web3;
const DEFAULT_GAS = 64209;

class Events extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      symbol: '',
      price: '',
      supply: '',
      commission: 20,
      scalp_protection: 150,
    };

    web3 = new Web3(window.ethereum);
  }

  onCreateEvent = async (e) => {
    try {
      e.preventDefault();

      const organizer = await web3.eth.getCoinbase();
      const { name, symbol, price, supply, commission, scalp_protection } = this.state;
      const { events: { Created: { returnValues: { ntfAddress, marketplaceAddress } } } } = await eventFactory.methods.createNewFest(
        eventToken._address,
        name,
        symbol,
        web3.utils.toWei(price, 'ether'),
        supply,
        commission,
        scalp_protection
      ).send({ from: organizer, gas: DEFAULT_GAS });

      renderNotification('success', 'Success', `Event Created Successfully!`);

      const nftInstance = await EventNFT(ntfAddress);
      const batches = Math.ceil(supply / 30);
      let batchSupply = 30;
      let curCount = 0
      let prevCount = 0

      if (supply < 30) {
        const res = await nftInstance.methods.bulkMintTickets(supply, marketplaceAddress).send({ from: organizer, gas: DEFAULT_GAS });
      } else {
        for (let i = 0; i < batches; i++) {
          prevCount = curCount;
          curCount += 30;
          if (supply < curCount) {
            batchSupply = supply - prevCount;
          }
          const res = await nftInstance.methods.bulkMintTickets(batchSupply, marketplaceAddress).send({ from: organizer, gas: DEFAULT_GAS });
        }
      }
    } catch (err) {
      console.log('Error while creating new event', err);
      renderNotification('danger', 'Error', `${err.message}`);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
          <div class="container" style={{backgroundColor: '#F5F8FA', backgroundOpacity: 0.5, marginTop: 40, boxShadow: '0px 10px 10px #888888', width: '50%', border: '1px solid black', padding: 30, paddingTop: 20, borderRadius: 10}}>
            <Text fontSize='4xl' padding={18}>Create New Event</Text>
            {this.state.name && <Text mb='8px'>Event Name</Text>}
              <Input style={styles.input} placeholder='Event Name' value={this.state.name} onChange={(event) => this.setState({name: event.target.value})} />

              {this.state.symbol && <Text mb='8px'>Event Ticker Symbol</Text>}
              <Input style={styles.input} placeholder='Event Ticker Symbol' value={this.state.symbol}  onChange={(event) => this.setState({symbol: event.target.value})} />

              {this.state.price && <Text mb='8px'>Ticket Price</Text>}
              <Input style={styles.input} placeholder='Ticket Price' value={this.state.price}  onChange={(event) => this.setState({price: event.target.value})} />

              {this.state.supply && <Text mb='8px'>Total Ticket Amount</Text>}
              <Input style={styles.input} placeholder='Total Ticket Amount' value={this.state.supply}  onChange={(event) => this.setState({supply: event.target.value})} />

              {this.state.commission && <Text mb='8px'>Commission (%)</Text>}
              <Input style={styles.input} placeholder='Commission (%)' value={this.state.commission}  onChange={(event) => this.setState({commission: event.target.value})} />

              {this.state.scalp_protection && <Text mb='8px'>Maximum Resale Price (%)</Text>}
              <Input style={styles.input} placeholder='Maximum Resale Price (%)' value={this.state.scalp_protection}  onChange={(event) => this.setState({scalp_protection: event.target.value})} />
              <Button colorScheme='teal' size='lg' marginTop={-2} onClick={(e) => this.onCreateEvent(e)}>
                Create New Event
              </Button>
          </div>
      </div >
    )
  }
}

const styles = {
  input: {
    textAlign: 'center',
    marginBottom: 35,
  }
};

export default Event;
