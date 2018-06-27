var config = require('../src/config/index');
var Voting = artifacts.require("./Voting.sol");
var CorrToken = artifacts.require("./CorrToken.sol");
var CorrTokenSale = artifacts.require("./CorrTokenSale.sol");

module.exports = function (deployer) {
      deployer.deploy(CorrToken, 1000000).then(() => {
            deployer.deploy(Voting, CorrToken.address, config.token.supply, web3.toWei(config.token.price, 'ether'), config.candidates);
            return deployer.deploy(CorrTokenSale, CorrToken.address, 1000000000);
      });
};

// module.exports = function (deployer) {
//       ///////////////////////////////////////////
//       // var tokenPrice = 1000000000;
//       var supply = config.token.supply;
//       var tokenPrice = web3.toWei(config.token.price, 'ether');
//       deployer.deploy(CorrToken, supply).then(() => {
//             deployer.deploy(Voting, CorrToken.address, supply, tokenPrice, config.candidates);
//             return deployer.deploy(CorrTokenSale, CorrToken.address, tokenPrice);
//       });
// };

// CorrTokenSale.deployed().then(function(i){ctsInst=i})
// ctsInst.buy(2, {value: 2000000000})
// ctInst.approve(web3.eth.accounts[0], 10)
// vInst.registerVoter(web3.fromUtf8('Jenni'))
// vInst.voteForCandidate(web3.fromUtf8('Jill'), web3.fromUtf8('Jenni'))

