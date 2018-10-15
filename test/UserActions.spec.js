const cf = require('../src/config');
const Web3 = require('web3');
const helpers = require('../testHelpers');
const Users = artifacts.require('./Users.sol');
const CorrToken = artifacts.require('./CorrToken.sol');
const Candidates = artifacts.require('./Candidates.sol');
const UserActions = artifacts.require('./UserActions.sol');
const CorrTokenSale = artifacts.require('./CorrTokenSale.sol');

const web3 = new Web3();
const { tryCatchWrapper, assertRevert } = helpers;

contract( 'UserActions:', accounts => {
      let voteForCandidate, totalVotesFor, addCandidateInfo;
      let votingContract, tokenContract, tokenSaleContract;
      const admin = accounts[0];
      const user = accounts[1];
      const user2 = accounts[2];
      const candidates = cf.candidates;

      before( async () => {
            tokenContract = await CorrToken.deployed();
            votingContract = await UserActions.deployed();
            tokenSaleContract = await CorrTokenSale.deployed();
            // wrap with try catch block
            totalVotesFor = tryCatchWrapper(votingContract.totalVotesFor);
            voteForCandidate = tryCatchWrapper(votingContract.voteForCandidate);
            addCandidateInfo = tryCatchWrapper(votingContract.addCandidateInfo);
            // provision the token contract sale
            tokenContract.transfer(tokenSaleContract.address, cf.token.available, {from: admin});
      })

      it( 'Initialiases contract', async () => {
            let data, name = [];
            // this contract address
            const instAddress = await votingContract.address;
            assert.notEqual(instAddress, '0x000000000000', 'The contract has a contract address' );
            // gets the token contract address
            const tokenContractAddress = await votingContract.tokenContract();
            assert.notEqual(tokenContractAddress.slice(0, 5), '0x000', 'Gets the address of the token contract' );
             // gets the token contract address
             const tokenContractSaleAddress = await votingContract.tokenSaleContract();
             assert.notEqual(tokenContractSaleAddress.slice(0, 5), '0x000', 'Gets the address of the token sale contract' );
             // gets the users contract address
            const usersContractAddress = await votingContract.usersContract();
            assert.notEqual(usersContractAddress.slice(0, 5), '0x000', 'Gets the address of the users contract' );
            // gets the candidates contract address
            const candidatesContractAddress = await votingContract.candidatesContract();
            assert.notEqual(candidatesContractAddress.slice(0, 5), '0x000', 'Gets the address of the candidates contract' );
      });

      // ADD VOTE FOR CANDIDATE
      it('Allows a user to vote for a candidate', async () => {
            let e;
            const name = 'Jennifer';
            const candidate = candidates[1];

            // reverts if user not registered
            e = await voteForCandidate(candidate, 'Unknown', {from: user});
            assertRevert(e, 'reverts if user is not registered');

            // we register this user
            const usersContract = await Users.deployed();
            await usersContract.registerUser(name);

            // reverts if user does not have enough fund
            e = await voteForCandidate(candidate, name, {from: user});
            assertRevert(e, 'reverts if user does not have enough fund');

            // provides some fund to the user
            await tokenContract.transfer(user, 2, {from: admin});

            // and allow voting contract to transfer one token on user behalf
            tokenContract.approve(votingContract.address, 1, {from: user});

            // reverts if not a valid candidate
            e = await voteForCandidate('Unknown', name, {from: user});
            assertRevert(e, 'reverts if it is not a valid candidate');

            // successful transaction
            await voteForCandidate(candidate, name, {from: user});
            const candidatesContract = await Candidates.deployed();

            // successful tansaction: add vote to candidate tally
            const votes = await candidatesContract.candidateVotes(candidate);
            assert.equal(votes.toNumber(), 1, 'Vote count for this candidate is incremented');

            // successful tansaction: update user voting record
            const [record] = await usersContract.userData(name);
            assert.deepEqual(record.toString(), '0,1,0' , 'Keeps track of whom the user voted for');

            // transfer 1 token out of the user balance (we provisioned the user balance with 2 tokens previously)
            const userBalance = await tokenContract.balanceOf(user);
            assert.equal(userBalance.toNumber(), 1, 'One token has been transfered out of user wallet');

            // transfer 1 token into the token sale contract  balance
            const tokenSaleContractBalance = await tokenContract.balanceOf(tokenSaleContract.address);
            assert.equal(tokenSaleContractBalance.toNumber(), cf.token.available + 1, 'One token has been transfered into the token sale contract');
      });

      it('Allows to add info about a candidate', async () => {
            const name = 'Matt';
            const candidate = candidates[1];

            // reverts if user not registered
            let e = await addCandidateInfo(candidate, 'Title', 'Description', 'FileHash', name, {from: user2});
            assertRevert(e, 'reverts if user is not registered');

            // we register this user
            const usersContract = await Users.deployed();
            await usersContract.registerUser(name);

            // successful transaction
            await addCandidateInfo(candidate, 'Title', 'Description', 'FileHash', name, {from: user2});

            // succcessful transaction: add the info to the candidate struct
            const candidatesContract = await Candidates.deployed();
            const [title, description, attachmentHash] = await candidatesContract.candidateInfo(candidate, 0);
            assert.equal(web3.toUtf8(title), 'Title', 'Sets the title in the new entry in the candidate info array')
            assert.equal(web3.toUtf8(description), 'Description', 'Sets the description in the new entry in the candidate info array')
            assert.equal(web3.toUtf8(attachmentHash), 'FileHash', 'Sets the attachment hash in the new entry in the candidate info array')

            // succcessful transaction: transfer 2 tokens from the token sale contract to the user
            const userBalance = await tokenContract.balanceOf(user2);
            assert.equal(userBalance.toNumber(), 1, 'One token has been transfered into user balance');
            const tokenSaleContractBalance = await tokenContract.balanceOf(tokenSaleContract.address);
            // token sale contract balance now equal to all tokens available number has one was substrated in the "addVote " test
            assert.equal(tokenSaleContractBalance.toNumber(), cf.token.available, 'One token has been transfered out of the token sale contract balance');
      });
})