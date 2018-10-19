const Web3 = require('web3');
const config = require('../src/config');
const helpers = require('../testHelpers');
const Candidates = artifacts.require('./Candidates.sol')

const web3 = new Web3();
const candidate1 = config.candidates[1];
const candidate2 = config.candidates[2];
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
            let result = await instance.indexOfCandidate.call(candidate1);
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
            await addInfo(candidate1, 'title', 'description', 'fileHash');
            const item = await instance.candidateInfo(candidate1, 0);
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

            // successful transaction: increment candidate tally to 1
            await addVoteFor(candidate1);
            vote = await instance.candidateVotes(candidate1);
            assert.equal(vote.toNumber(), 1, 'Increments the vote tally for the candidate passed');

            // successful transaction: increment candidate tally to 2
            await addVoteFor(candidate1);
            vote = await instance.candidateVotes(candidate1);
            assert.equal(vote.toNumber(), 2, 'Increments the vote tally for the candidate passed');
      });

      // RETRIEVE A CANDIDATE INFO
      it('Allows to retrieve all the info for a candidate', async () => {
            let info;
            // add some infos for this candidate
            await addInfo(candidate2, 'title1', 'description1', 'fileHash1');
            await addInfo(candidate2, 'title2', 'description2', 'fileHash2');

            // then retrieve fisrt one
            info = await instance.getCandidateInfoAt(candidate2, 0);
            assert.equal(web3.toUtf8(info[0]), 'title1', 'Returns the title as 1st entry in array');
            assert.equal(web3.toUtf8(info[1]), 'description1', 'Returns the description as 2nd entry in array');
            assert.equal(web3.toUtf8(info[2]), 'fileHash1', 'Returns the attachment hash as 3rd entry in array');

            // then retrieve second one
            info = await instance.getCandidateInfoAt(candidate2, 1);
            assert.equal(web3.toUtf8(info[0]), 'title2', 'Returns the title as 1st entry in array');
            assert.equal(web3.toUtf8(info[1]), 'description2', 'Returns the description as 2nd entry in array');
            assert.equal(web3.toUtf8(info[2]), 'fileHash2', 'Returns the attachment hash as 3rd entry in array');

            // returns empty array if no info left to retrive
            info = await instance.getCandidateInfoAt(candidate2, 2);
            assert.equal(web3.toUtf8(info[0]), '', 'Returns array of empty hex if no info yet entered for this candidate');
            assert.equal(web3.toUtf8(info[1]), '', 'Returns array of empty hex if no info yet entered for this candidate');
            assert.equal(web3.toUtf8(info[2]), '', 'Returns array of empty hex if no info yet entered for this candidate');

      });
});