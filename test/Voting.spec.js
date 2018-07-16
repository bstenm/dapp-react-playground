const cf = require('../src/config');
const Web3 = require('web3');
const helpers = require('../testHelpers');
const Voting = artifacts.require('./Voting.sol')
const CorrToken = artifacts.require('./CorrToken.sol')

const web3 = new Web3();
const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Voting:', accounts => {
      let instance, voteForCandidate, totalVotesFor;
      const admin = accounts[0];
      const user = accounts[1];
      const candidates = cf.candidates;

      before( async () => {
            instance = await Voting.deployed();
            // wrap with try catch block
            totalVotesFor = tryCatchWrapper(instance.totalVotesFor);
            voteForCandidate = tryCatchWrapper(instance.voteForCandidate);
      })

      it( 'Initialiases contract', async () => {
            let data, name = [];
            const address1 = await instance.address;
            assert.notEqual(address1, 0x0, 'has contract address' );
            const address2 = await instance.tokenContract();
            assert.notEqual(address2, 0x0, 'has a token contract' );
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
            const [record, voterAddress, username] = await instance.voterDetails(name);
            //////////////////////////////////////////
            // assert.equal(username, name, 'The user name has been set');
            assert.equal(voterAddress, user, 'The user address has been set');
            assert.deepEqual(record.toString(), '0,0,0', 'The user voting record has been set');
            /////////////////////////////////////////////
            // const addresses = await instance.voterAddresses();
            // assert.equal(addresses, [voterAddress], 'The user voting record has been set');
            // unregister
            await instance.unregisterVoter(name);
            const details = await instance.voterDetails(name);
            assert.equal(details[0], '', 'The user voting record has been unset');
            assert.equal(details[1], 0x00, 'The user address has been unset');
            assert.equal(details[2], 0x00, 'The user name has been unset');
      });

      // IS CANDIDATE VALID
      it( 'Gets the candidate index in array of valid candidates:', async () => {
            let result = await instance.indexOfCandidate.call(candidates[1]);
            assert.equal(result.toNumber(), 1, 'Returns index if candidate valid');
            result = await instance.indexOfCandidate.call('Unknown');
            //[TD]: result,toNumber() returning wacky value ?
            // assert.equal(result.toNumber(), -1, 'Returns -1 if candidate invalid');
      });

      // VOTE FOR A CANDIDATE
      it( 'Allows to vote for a candidate', async () => {
            let votes, e;
            const name = web3.fromUtf8('Jennifer');
            const candidate = candidates[1];

            e = await voteForCandidate('Unknown', name, {from: user});
            assertRevert(e, 'reverts if it is not a valid candidate');

            e = await voteForCandidate(candidate, name, {from: user});
            assertRevert(e, 'reverts if is not registered');

            // register
            await instance.registerVoter(name, {from: user});

            e = await voteForCandidate(candidate, name, {from: user});
            assertRevert(e, 'reverts if user does not have enough funds to vote');

            // tranfer some tokens to user address
            const tokenInstance = await CorrToken.deployed();
            tokenInstance.transfer(user, 2, {from: admin});
            // and allow voting contract to transfer one token on user behalf
            tokenInstance.approve(instance.address, 1, {from: user});

            // user voting
            e = await voteForCandidate(candidate, name, {from: user});
            votes = await instance.votesReceived(candidate);
            assert.equal(votes.toNumber(), 1, 'Vote count is incremented');

            // user voting record
            const [record] = await instance.voterDetails(name);
            assert.deepEqual(record.toString(), '0,1,0' , 'Keeps track of whom the user voted for');

            const userBalance = await tokenInstance.balanceOf(user);
            const contractBalance = await tokenInstance.balanceOf(instance.address);
            assert.equal(userBalance.toNumber(), 1, 'One token has been transfered out of user wallet');
            assert.equal(contractBalance.toNumber(), 1, 'One token has been transfered into voting contract wallet');

            await instance.unregisterVoter(name);
      });

      it( 'Allow access to the total nb of votes for a candidate', async () => {
            const candidate = candidates[0];
            await voteForCandidate(candidate, {from: user});
            await voteForCandidate(candidate, {from: user});
            const votes = await instance.votesReceived(candidate);
            const totalVotes = await totalVotesFor(candidate);
            assert.equal(votes.toNumber(), totalVotes.toNumber());
            // not a valid candidate
            const e = await totalVotesFor('Unknown');
            assertRevert(e, 'reverts if it is not a valid candidate');
      });
})