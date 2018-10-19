const cf = require('../src/config');
const Web3 = require('web3');
const helpers = require('../testHelpers');
const Users = artifacts.require('./Users.sol');
const CorrToken = artifacts.require('./CorrToken.sol');
const CorrTokenSale = artifacts.require('./CorrTokenSale.sol');

const web3 = new Web3();

const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Users:', accounts => {
      let instance, updateVotingRecord, tokenContract, tokenSaleContract;
      const admin = accounts[0];
      const user1 = accounts[1];
      const user2 = accounts[2];
      const user3 = accounts[3];

      before(async () => {
            instance = await Users.deployed();
            tokenContract = await CorrToken.deployed();
            tokenSaleContract = await CorrTokenSale.deployed();
            // wrap method that could revert
            updateVotingRecord = tryCatchWrapper(instance.updateVotingRecord);
      })

      // REGISTER NEW USER
      it('Allows to register a new user', async () => {
            // register
            await instance.register({from: user1});
            const [record, address] = await instance.userData(user1);
            // sets all the new user data
            assert.equal(address, user1, 'The user address has been set');
            assert.deepEqual(record.toString(), '0,0,0', 'The user voting record has been set');
      });

      // CHECK IF USER IS REGISTERED
      it('Checks if user is registered', async () => {
            let registered;
            await instance.register( {from: user2});
            // true if registered
            registered = await instance.isRegistered.call(user2);
            assert.equal(registered, true, 'Returns true if user is registered');
            // false if not registered
            registered = await instance.isRegistered.call(accounts[8]);
            assert.equal(registered, false, 'Returns false if user is not registered');
      });

      // VOTE FOR CANDIDATE
      it('Updates the voting record on voting event', async () => {
            let e;

            // reverts if user not registered
            e = await updateVotingRecord(1, {from: user3});
            assertRevert(e, 'reverts if user is not registered');

            // we now register this user
            await instance.register({from: user3});
            // then provides some fund to the user
            await tokenContract.transfer(user3, 2, {from: admin});
            // and approve Users contract to spend those tokens on user's behalf
            await tokenContract.approve(instance.address, 2, {from: user3});

            // successful transaction: vote for candidate with index 1 in the list set in config
            await updateVotingRecord(1, {from: user3});

            // transfer one token from user's account back the the token sale contract balance
            const userBalance = await tokenContract.balanceOf(user3);
            assert.equal(userBalance.toNumber(), 1, ' deducts one token from user\'s account');
            const tokenSaleBalance = await tokenContract.balanceOf(tokenSaleContract.address);
            assert.equal(tokenSaleBalance.toNumber(), 1, ' increment the token sale contract balance by one');

            // successful transaction: update voting record
            const [record] = await instance.userData(user3);
            assert.equal(record.toString(), '0,1,0', 'Increments the vote number at the index corresponding to the one of the candidate in the candidate list');
      });
})