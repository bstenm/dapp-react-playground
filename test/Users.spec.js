const Web3 = require('web3');
const helpers = require('../testHelpers');
const Users = artifacts.require('./Users.sol')

const web3 = new Web3();
const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Users:', accounts => {
      let instance;
      const user1 = accounts[1];
      const user2 = accounts[2];
      const user3 = accounts[3];

      before( async () => {
            instance = await Users.deployed();
      })

      // REGISTER NEW USER
      it('Allows to register a new user', async () => {
            const name = web3.fromUtf8('Jennifer');
            // register
            await instance.registerUser('Jennifer', {from: user1});
            const [record, address, username] = await instance.userData(name);
            // sets all the new user data
            assert.equal(username.slice(0, 18), name, 'The user name has been set');
            assert.equal(address, user1, 'The user address has been set');
            assert.deepEqual(record.toString(), '0,0,0', 'The user voting record has been set');
            // keeps track of all user addresses (for ganache only)
            const addresses = await instance.userAddresses(0);
            assert.equal(addresses, [address], 'The user voting record has been set');
      });

      // CHECK IF USER IS REGISTERED
      it('Checks if user is registered', async () => {
            let registered;
            await instance.registerUser('Jenni', {from: user2});
            // true if registered
            registered = await instance.isRegistered.call('Jenni');
            assert.equal(registered, true, 'Returns true if user is registered');
            // false if not registered
            registered = await instance.isRegistered.call('Unknown');
            assert.equal(registered, false, 'Returns true if user is registered');
      });

      // UPDATE TO VOTING RECORD
      it('Updates the voting record on voting event', async () => {
            // first register a new user
            await instance.registerUser('Jen', {from: user3});
            // successful transaction: vote for 2nd candidate in the list set in config
            await instance.addVoteFor(1, 'Jen');
            const [record] = await instance.userData('Jen');
            assert.equal(record.toString(), '0,1,0', 'Increments the vote number for the index corresponding to the one of the candidate in the candidate list');
      });
})