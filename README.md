# NFT Ticketing Platform


### Overview 
Ticketing Platform for events that leverages NFTs to create a more secure and decentralized ecosystem for ticket purchasing and resale. NFT ticketing platform where event organizers can create events and tickets, users can buy/sell tickets both in the primary and secondary market. By incorporating the NFT aspect into our design, we should be able to have a more secure ticket verification system that will not be vulnerable to scammers or scalpers. Through our project we were able to create a successful prototype of the NFT ticketing platform that accomplishes these core functions: 

* Creation of Events
* Purchase of Event Tickets
* Reselling of Event Tickets
* Commission for Sale in Secondary Markets
* Scalp Protection of Events
* Verified Ticket Display 
* Attaching Memorabilia

### Feature Overview
1. Event creater can create an event with a ticket price, total supply, a desired commission, and a max scalp limit.
2. Customers can view all created events via the web portal and make purchases, both through the primary and secondary market.
3. Customers can view all their tickets for any event which is validated to be a legitimate NFT ticket for the event.
4. Customers can resell their owned tickets on secondary market, but at no more than the max scalp limit, and all resales are charged a commission based on what organizer filled for the event. (ie. Ticket costs 150 FEST from the market, Max Scalp = 200%, Commission = 15% then someone can resale their ticket for anything less than 300 FEST , and so if they sell it for 250 FEST, the commission of 37.5 FEST is sent to the organizer.
5. Event organizers can attach memorabilia to tickets and via the UI users can view the memorabilia they were airdropped (UI display pending)

### Technical Details
##### Smart Contract
Mainly 4 contracts listed under `./contracts` directory.
1. **EventToken** - 
    1. A contract for ERC20 token called FEST which is used to purchase tickets.
2. **EventNFT** - 
    1. A contract for ERC721 tokens to represent event tickets.
    2. The owner of the contract will also have minter role and only the owner can mint new tickets.
3. **EventMarketplace** - 
    1. A contract which acts as a marketplace for purchasing tickets from organizer and through secondary market.
    2. This contract will act as a delegate approver for the FEST token as well as NFT token transfers.
4. **EventTicketsFactory** - 
    1. A contract which implements a factory pattern with Event NFT contract to create new events on the fly.

### Running the application
##### Prerequisite
1. Docker
2. Metamask plugin for browser

##### Steps
1. Clone the project.
2. Start the docker application.
3. Run the below command from the root directory to run the Ethereum client and deploy the smart contracts to the network.
    ```sh
    docker-compose up --build
    ```
4. Note down first couple of private keys from the output logs.
5. Note down the FEST contract address.
4. Run the below command from `./client` directory to run the react application.
    ```sh
    docker-compose up --build
    ```
5. React application will be accessible at `http://localhost:3000/`.
6. Configure the Metamask with RPC url `http://0.0.0:8545`.
7. Import the accounts in the Metamask by taking 1st private key from step 4 and setting it as an organizer. Add couple more accounts in Metamask to act as a customers.
8. Add new FEST token in Metamask using the contract address from step 5.
9. Transfer some amount of FEST  tokens from organizer to other customers using Metamask for testing the application.
10. Set up is completed and now the organizer account will be able to add new event and customers will be able to purchase/sell the tickets.


#### Future Steps
1. We were able to setup code on the backend of solidity to handle memorabilia attachments, but due to some bugs and time delay we did not add the UI for users to be able to see the attachments. 
2. On the back end we want to create more analytics and overall data views for us at the owners of NFT Ticketing Platform to see flow and transactions on the site.
3. There are slight bugs that have to do with input formatting so we would like to clean that up.
4. We would like to optimize our functions to limit gas costs, and set up a way to handle ticket transfers within the site with no gas cost.
5. We made an overall to the base UI to make the experience more clear, so further development and improvements there would continue helping the user experience. 
