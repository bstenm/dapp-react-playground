const Web3 = require('web3');
const config = require('../src/config');
const helpers = require('../testHelpers');
const Candidates = artifacts.require('./Candidates.sol')

const web3 = new Web3();
const {tryCatchWrapper, assertRevert} = helpers;

contract('Candidates:', accounts => {
      let instance, addInfo, addVoteFor;

      before(async () => {
            instance = await Candidates.deployed();
            addInfo = tryCatchWrapper(instance.addInfo);
            addVoteFor = tryCatchWrapper(instance.addVoteFor);
      });

      // IS CANDIDATE VALID
      it('Gets the candidate index in array of valid candidates:', async () => {
            let result = await instance.indexOfCandidate.call(config.candidates[1]);
            assert.equal(result.toNumber(), 1, 'Returns index if candidate valid');
            // invalid candidate name
            result = await instance.indexOfCandidate.call('Unknown');
            // [TODO]: why result.toNumber() returns wacky number?
            // assert.equal(result.toNumber(), -1, 'Returns 0 if candidate invalid');
      });

      // ADD CANDIDATE INFO
      it('Allows to add a new item to a candidate\'s info list', async () => {
            // reverts
            let e = await addInfo('Unknown', 'title', 'description', 'fileHash');
            assertRevert(e, 'Reverts if the candidate is invalid');

            // successful transaction
            await addInfo('Trump', 'title', 'description', 'fileHash');
            const item = await instance.candidateInfo('Trump', 0);
            assert.equal(web3.toUtf8(item[0]), 'title', 'Sets the item title');
            assert.equal(web3.toUtf8(item[1]), 'description', 'Sets the item description');
            assert.equal(web3.toUtf8(item[2]), 'fileHash', 'Sets the item attachment hash');
      })

      // ADD VOTE TO CANDIDATE TALLY
      it('Allows to add a vote to a candidate', async () => {
            let vote;

            // Candidate not valid
            let e = await addVoteFor('Unknown');
            assertRevert(e, 'Reverts if the candidate is not a valid one')

            // successful transaction: increment candidate tally
            await addVoteFor('Trump');
            vote = await instance.candidateVotes('Trump');
            assert.equal(vote.toNumber(), 1, 'Increments the vote tally for the candidate passed');

            // successful transaction: increment candidate tally
            await addVoteFor('Trump');
            vote = await instance.candidateVotes('Trump');
            assert.equal(vote.toNumber(), 2, 'Increments the vote tally for the candidate passed');
      });
});