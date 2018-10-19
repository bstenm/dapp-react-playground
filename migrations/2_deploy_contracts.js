var config = require('../src/config/index');
var Users = artifacts.require("./Users.sol");
var Banking = artifacts.require("./Banking.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var Candidates = artifacts.require("./Candidates.sol");
var UserActions = artifacts.require("./UserActions.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      deployer
      .deploy(CorrToken, config.token.supply)
      .then(() => deployer.deploy(CorrTokenSale, CorrToken.address, config.token.priceInWei))
      .then(() => deployer.deploy(Users, CorrToken.address, CorrTokenSale.address))
      .then(() => deployer.deploy(Candidates, config.candidates))
      .then(() => deployer.deploy(Banking, CorrToken.address))
};
