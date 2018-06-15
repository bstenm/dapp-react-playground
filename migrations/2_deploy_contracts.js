var config = require('../src/config/index');
var Voting = artifacts.require("./Voting.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      deployer.deploy(Voting, config.token.supply, web3.toWei(config.token.price, 'ether'), config.candidates);
      deployer.deploy(CorrToken, 1000000).then(() => {
            return deployer.deploy(CorrTokenSale, CorrToken.address, 1000000000);
      });
};