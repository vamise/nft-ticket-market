const EventToken = artifacts.require("EventToken");
const EventTicketsFactory = artifacts.require("EventTicketsFactory");

module.exports = function(deployer) {
    deployer.deploy(EventToken);
    deployer.deploy(EventTicketsFactory);
};