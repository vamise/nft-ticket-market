import Provider from './Provider';
import { eventMarketplaceABI } from '../constants';

const provider = new Provider();

const EventMarketplace = (contractAddress) => {
    const web3 = provider.web3;

    return new web3.eth.Contract(eventMarketplaceABI, contractAddress);
};

export default EventMarketplace;