pragma solidity ^0.6.0;

import "./EventNFT.sol";
import "./EventToken.sol";

contract EventMarketplace {
    EventToken private _token;
    EventNFT private _event;

    address private _organizer;

    constructor(EventToken token, EventNFT event) public {
        _token = token;
        _event = event;
        _organizer = _event.getOrganizer();
    }

    event Purchase(address indexed buyer, address seller, uint256 ticketId);

    // Purchase tickets from the organizer directly
    function purchaseTicket() public {
        address buyer = msg.sender;

        _token.transferFrom(buyer, _organizer, _event.getTicketPrice());

        _event.transferTicket(buyer);
    }

    // Purchase ticket from the secondary market hosted by organizer
    function secondaryPurchase(uint256 ticketId) public {
        address seller = _event.ownerOf(ticketId);
        address buyer = msg.sender;
        uint256 sellingPrice = _event.getSellingPrice(ticketId);
        uint256 commision = (sellingPrice * _event.getCommission()) / 100;

        _token.transferFrom(buyer, seller, sellingPrice - commision);
        _token.transferFrom(buyer, _organizer, commision);

        _event.secondaryTransferTicket(buyer, ticketId);

        emit Purchase(buyer, seller, ticketId);
    }
}
