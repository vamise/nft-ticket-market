import Provider from './Provider';
import eventFactoryABI from '../abi/contracts/EventTicketsFactory.json';

const provider = new Provider();

class eventFactory {
    constructor() {
        const web3 = provider.web3;
        const deploymentKey = Object.keys(eventFactoryABI.networks)[0];

        this.instance = new web3.eth.Contract(
            eventFactoryABI.abi,
            eventFactoryABI.networks[deploymentKey].address,
        );
    }

    getInstance = () => this.instance;
}

const eventFactory = new eventFactory();
Object.freeze(eventFactory);

export default eventFactory.getInstance();