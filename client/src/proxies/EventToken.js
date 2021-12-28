import Provider from './Provider';
import EventToken from '../abi/contracts/EventToken.json';

const provider = new Provider();

class Token {
    constructor() {
        const web3 = provider.web3;
        const deploymentKey = Object.keys(EventToken.networks)[0];

        this.instance = new web3.eth.Contract(
            EventToken.abi,
            EventToken.networks[deploymentKey].address,
        );
    }

    getInstance = () => this.instance;
}

const token = new Token();
Object.freeze(token);

export default token.getInstance();