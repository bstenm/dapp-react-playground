var config = require('../src/config/index');
var Voting = artifacts.require("./Voting.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      ///////////////////////////////////////////
      // var tokenPrice = 1000000000;
      var tokenPrice = web3.toWei(config.token.price, 'ether');
      deployer.deploy(Voting, config.token.supply, tokenPrice, config.candidates);
      deployer.deploy(CorrToken, config.token.supply).then(() => {
            return deployer.deploy(CorrTokenSale, CorrToken.address, tokenPrice);
      });
};