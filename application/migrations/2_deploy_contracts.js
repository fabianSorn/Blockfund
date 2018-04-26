var BlockFund = artifacts.require("../contracts/Blockfund.sol");
var Project = artifacts.require("./Project.sol");

module.exports = function(deployer) {
  deployer.deploy(BlockFund);
};
