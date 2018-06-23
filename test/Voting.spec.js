const cf = require('../src/config');
const Web3 = require('web3');
const helpers = require('../testHelpers');
const Voting = artifacts.require('./Voting.sol')

const web3 = new Web3();
const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Voting:', accounts => {
      let instance, buy, voteForCandidate, totalVotesFor;
      const user = accounts[0];
      const user2 = accounts[1];
      const candidates = cf.candidates;
      const totalSupply = cf.token.supply;
      const  pricePerToken = web3.toWei(cf.token.price, 'ether'); // in wei

      before( async () => {
            instance = await Voting.deployed();
            // wrap with try catch block
            buy = tryCatchWrapper(instance.buyTokens);
            totalVotesFor = tryCatchWrapper(instance.totalVotesFor);
            voteForCandidate = tryCatchWrapper(instance.voteForCandidate);
      })

      it( 'Initialiases contract', async () => {
            let data, name = [];
            data = await instance.tokensAvailable();
            assert.equal(data.toNumber(), totalSupply, 'with the total supply of tokens');
            data = await instance.tokenPrice();
            assert.equal(data.toNumber(), pricePerToken, 'with the price in wei per token');
            name[0] = web3.toUtf8(await instance.candidateList(0));
            name[1] = web3.toUtf8(await instance.candidateList(1));
            name[2] = web3.toUtf8(await instance.candidateList(2));
            assert.deepEqual(name, candidates, 'with the names of the candidates');
      });

      // REGISTER NEW USER
      it('Allows to register and unregister a new user', async () => {
            const name = web3.fromUtf8('Jennifer');
            // register
            await instance.registerVoter(name, {from: user});
            const [tokens, record, voterAddress] = await instance.voterDetails(name);
            assert.equal(voterAddress, user, 'The user address has been set');
            assert.equal(tokens, 0, 'The user nb of tokens has been set');
            assert.deepEqual(record.toString(), '0,0,0', 'The user voting record has been set');
            // unregister
            await instance.unregisterVoter(name);
            const details = await instance.voterDetails(name);
            assert.equal(details[0].toNumber(), '', 'The user token has been unset');
            assert.equal(details[1], '', 'The user voting record has been unset');
            assert.equal(details[2], 0x00, 'The user name has been unset');
      });

      // BUY TOKENS
      it( 'Allows to buy tokens', async () => {
            const name = web3.fromUtf8('Jennifer');
            let e = await buy(name, {from: user, value: 1 * pricePerToken});
            assertRevert(e, 'cannot buy if user not registered');
            // register
            await instance.registerVoter(name, {from: user});
            e = await buy(name, {from: user, value: (totalSupply + 1) * pricePerToken});
            assertRevert(e, 'cannot buy if value exceeds the total supply of tokens');
            // buys 1/8
            await buy(name, {from: user, value: (totalSupply / 8) * pricePerToken});
            // buys another 1/8
            await buy(name, {from: user, value: (totalSupply / 8) * pricePerToken});
            // now get user account
            const [tokens] = await instance.voterDetails(name);
            // 1/8 + 1/8 = 1/4
            assert.equal(tokens, totalSupply / 4, 'updates the user quantity of tokens');
            // tokens left: 1 - 1/4
            const tokensAvailable = await instance.tokensAvailable();
            assert.equal(tokensAvailable.toNumber(), 3 * totalSupply / 4, 'updates the number of tokens available for purchase');
            // returns nb of tokens bought
            const tokensBought = await instance.buyTokens.call(name, {from: user, value: 10 * pricePerToken});
            assert.equal(tokensBought.toNumber(), 10, 'returns nb of tokens bought if transaction was successful');
            // unregister user
            await instance.unregisterVoter(name);
      });

      // IS CANDIDATE VALID
      it( 'Gets the candidate index in array of valid candidates:', async () => {
            let result = await instance.indexOfCandidate.call(cf.candidates[1]);
            assert.equal(result.toNumber(), 1, 'Returns index if candidate valid');
            result = await instance.indexOfCandidate.call('Unknown');
            //[TD]: result,toNumber() returning wacky value ?
            // assert.equal(result.toNumber(), -1, 'Returns -1 if candidate invalid');
      });

      // VOTE FOR A CANDIDATE
      it( 'Allows to vote for a candidate', async () => {
            let votes, e;
            const name = web3.fromUtf8('Jennifer');
            // one candidate
            const candidate = cf.candidates[1];
            // require user is registered
            e = await voteForCandidate(candidate, name);
            assertRevert(e, 'reverts if is not registered');
            // register
            await instance.registerVoter(name, {from: user});
            // require user has enough funds
            e = await voteForCandidate(candidate, name);
            assertRevert(e, 'reverts if user does not have enough funds to vote');
            // get some funds
            await instance.buyTokens(name, {from: user, value: 2 * pricePerToken});
            // require a valid candidate
            e = await voteForCandidate('Unknown', name);
            assertRevert(e, 'reverts if it is not a valid candidate');
            // user voting
            await voteForCandidate(candidate, name);
            votes = await instance.votesReceived(candidate);
            assert.equal(votes.toNumber(), 1, 'Vote count is incremented');
            // user account
            const [tokens, record] = await instance.voterDetails(name);
            assert.equal(tokens.toNumber(), 2 - 1 , 'Decrement the nb of tokens available for this user');
            assert.deepEqual(record.toString(), '0,1,0' , 'Keeps track of whom the user voted for')
            // unregister
            await instance.unregisterVoter(name);
      });

      it( 'Allow access to the total nb of votes for a candidate', async () => {
            const candidate = cf.candidates[0];
            await voteForCandidate(candidate, {from: user});
            await voteForCandidate(candidate, {from: user});
            const votes = await instance.votesReceived(candidate);
            const totalVotes = await totalVotesFor(candidate);
            assert.equal(votes.toNumber(), totalVotes.toNumber());
            // not a vlid candidate
            const e = await totalVotesFor('Unknown');
            assertRevert(e, 'reverts if it is not a valid candidate');
      });
})