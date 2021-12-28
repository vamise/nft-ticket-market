pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventNFT.sol";
import "./EventMarketplace.sol";

contract EventTicketsFactory is Ownable {
    struct Event {
        string eventName;
        string eventSymbol;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    address[] private activeEvents;
    mapping(address => Event) private activeEventsMapping;

    event Created(address ntfAddress, address marketplaceAddress);

    // Creates new NFT and a marketplace for its purchase
    function createNewEvent(
        EventToken token,
        string memory eventName,
        string memory eventSymbol,
        uint256 ticketPrice,
        uint256 totalSupply,
        uint256 commission,
        uint256 maxSell
    ) public onlyOwner returns (address) {
        EventNFT newEvent =
            new EventNFT(
                eventName,
                eventSymbol,
                ticketPrice,
                totalSupply,
                commission,
                maxSell,
                msg.sender
            );

        EventMarketplace newMarketplace =
            new EventMarketplace(token, newEvent);

        address newEventAddress = address(newEvent);

        activeEvents.push(newEventAddress);
        activeEventsMapping[newEventAddress] = Event({
            eventName: eventName,
            eventSymbol: eventSymbol,
            ticketPrice: ticketPrice,
            totalSupply: totalSupply,
            marketplace: address(newMarketplace)
        });

        emit Created(newEventAddress, address(newMarketplace));

        return newEventAddress;
    }

    // Get all active events
    function getActiveEvents() public view returns (address[] memory) {
        return activeEvents;
    }

    // Get event's details
    function getEventDetails(address eventAddress)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            address
        )
    {
        return (
            activeEventsMapping[eventAddress].eventName,
            activeEventsMapping[eventAddress].eventSymbol,
            activeEventsMapping[eventAddress].ticketPrice,
            activeEventsMapping[eventAddress].totalSupply,
            activeEventsMapping[eventAddress].marketplace
        );
    }
}
