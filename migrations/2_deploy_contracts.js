const config = require('../src/config/index');

const Users = artifacts.require('./Users.sol');
const Banking = artifacts.require('./Banking.sol');
const CorrToken = artifacts.require('./CorrToken.sol');
const Candidates = artifacts.require('./Candidates.sol');
const CorrTokenSale = artifacts.require('./CorrTokenSale.sol');

module.exports = function(deployer) {
      deployer.deploy(CorrToken, config.token.supply)
      .then(() => deployer.deploy(CorrTokenSale, CorrToken.address, config.token.priceInWei))
      .then(() => deployer.deploy(Users, CorrToken.address, CorrTokenSale.address))
      .then(() => deployer.deploy(Candidates, config.candidates))
      .then(() => deployer.deploy(Banking, CorrToken.address))
};
