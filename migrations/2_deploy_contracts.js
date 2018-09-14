var config = require('../src/config/index');
var Voting = artifacts.require("./Voting.sol");
var Banking = artifacts.require("./Banking.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      deployer
      .deploy(CorrToken, 1000000)
      .then(() => deployer.deploy(CorrTokenSale, CorrToken.address, 1000000000))
      .then(() => deployer.deploy(Voting, CorrToken.address, config.candidates))
      .then(() => deployer.deploy(Banking, CorrToken.address));
};
