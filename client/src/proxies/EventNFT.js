import Provider from './Provider';
import { EventNFTABI } from '../constants';

const provider = new Provider();

const EventNFT = (contractAddress) => {
    const web3 = provider.web3;

    return new web3.eth.Contract(EventNFTABI, contractAddress);
};

export default EventNFT;