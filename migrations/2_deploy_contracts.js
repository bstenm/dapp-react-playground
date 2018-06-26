var config = require('../src/config/index');
var Voting = artifacts.require("./Voting.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      ///////////////////////////////////////////
      // var tokenPrice = 1000000000;
      var supply = config.token.supply;
      var tokenPrice = web3.toWei(config.token.price, 'ether');
      deployer.deploy(Voting, supply, tokenPrice, config.candidates);
      deployer.deploy(CorrToken, supply).then(() => {
            return deployer.deploy(CorrTokenSale, CorrToken.address, tokenPrice);
      });
};