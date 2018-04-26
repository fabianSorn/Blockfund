var BlockFund = artifacts.require("./Blockfund.sol");
var Project = artifacts.require("./Project.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockFund);
};
