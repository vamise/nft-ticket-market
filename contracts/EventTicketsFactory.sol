pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventNFT.sol";
import "./EventMarketplace.sol";

contract EventTicketsFactory is Ownable {
    struct Event {
        string festName;
        string festSymbol;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    address[] private activeEvents;
    mapping(address => Event) private activeEventsMapping;

    event Created(address ntfAddress, address marketplaceAddress);

    // Creates new NFT and a marketplace for its purchase
    function createNewFest(
        EventToken token,
        string memory festName,
        string memory festSymbol,
        uint256 ticketPrice,
        uint256 totalSupply,
        uint256 commission,
        uint256 maxSell
    ) public onlyOwner returns (address) {
        EventNFT newFest =
            new EventNFT(
                festName,
                festSymbol,
                ticketPrice,
                totalSupply,
                commission,
                maxSell,
                msg.sender
            );

        EventMarketplace newMarketplace =
            new EventMarketplace(token, newFest);

        address newEventAddress = address(newFest);

        activeEvents.push(newEventAddress);
        activeEventsMapping[newEventAddress] = Event({
            festName: festName,
            festSymbol: festSymbol,
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
            activeEventsMapping[eventAddress].festName,
            activeEventsMapping[eventAddress].festSymbol,
            activeEventsMapping[eventAddress].ticketPrice,
            activeEventsMapping[eventAddress].totalSupply,
            activeEventsMapping[eventAddress].marketplace
        );
    }
}
