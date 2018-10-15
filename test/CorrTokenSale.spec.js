const config = require('../src/config/index');
const helpers = require('../testHelpers');
const CorrToken = artifacts.require('./CorrToken.sol');
const CorrTokenSale = artifacts.require('./CorrTokenSale.sol');

const {tryCatchWrapper, assertRevert} = helpers;

contract( 'CorrTokenSale', accounts => {
      let buy, endSale, reward;
      let tokenContract;
      let tokenSaleContract;

      const user1 = accounts[1];
      const user2 = accounts[2];
      const admin = accounts[0];
      const tokenPrice = config.token.priceInWei;
      const tokenAvailable = config.token.available;

      before(async () => {
            tokenContract = await CorrToken.deployed();
            tokenSaleContract = await CorrTokenSale.deployed();
            // wrap in try catch block fn we want to test "revert" for
            buy = tryCatchWrapper(tokenSaleContract.buy);
            reward = tryCatchWrapper(tokenSaleContract.reward);
            endSale = tryCatchWrapper(tokenSaleContract.endSale);
            // transfer some tokens to the token sale contract
            await tokenContract.transfer(tokenSaleContract.address, tokenAvailable, {from: admin});
      });

      it( 'Initialiases contract with correct values', async () => {
            const address1 = await tokenSaleContract.address;
            assert.notEqual(address1, 0x0, 'has contract address' );
            const address2 = await tokenSaleContract.tokenContract();
            assert.notEqual(address2, 0x0, 'has a token contract' );
            const price = await tokenSaleContract.tokenPrice();
            assert.equal(price.toNumber(), tokenPrice, 'token price is set');
      });

      it( 'Allows token buying process:', async () => {
            let e;
            const nbOfTokens = 10;
            const buyer = user1;
            const value = nbOfTokens * tokenPrice;

            // must have correct value
            e = await buy(nbOfTokens, {from: buyer, value: 1});
            assertRevert(e, 'Cannot buy nb of tokens if value is under the right price');
            e = await buy(nbOfTokens, {from: buyer, value: value + 1});
            assertRevert(e, 'Cannot buy nb of tokens if value exceeds right price');

            // contract must have enough fund
            e = await buy(tokenAvailable + 1, {from: buyer, value: (tokenAvailable + 1) * tokenPrice});
            assertRevert(e, 'Cannot buy if not enough tokens availlable in the sale contract');

            // successful transaction
            const receipt = await buy(nbOfTokens, {from: buyer, value});

            // sale event
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sale', 'the event is a "Sale"event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer address');
            assert.equal(receipt.logs[0].args._value.toNumber(), value, 'logs the value transfered');

            // must transfer amount from contract to buyer
            amount = await tokenContract.balanceOf(buyer);
            assert.equal(amount.toNumber(), nbOfTokens, 'Transfer the amount to the buyer');
            amount = await tokenContract.balanceOf(tokenSaleContract.address);
            assert.equal(amount.toNumber(), tokenAvailable - nbOfTokens, 'Deducts the amount from the token sale contract');

            // record numbe of tokens sold
            amount = await tokenSaleContract.tokensSold();
            assert.equal(amount.toNumber(), nbOfTokens, 'Keeps track of the tokens sold');
      });

      it('Allows to reward an account with free tokens ', async () => {
            const receiver = user2;

            // reverst if not ehough fund available
            const e = await reward(receiver, tokenAvailable + 1);
            assertRevert(e, 'Reverts if the token sale contract does not have enough funds');

            // successful transaction
            const receipt = await reward(receiver, 2);

            // successful transaction: user balance incremented
            const user2Balance = await tokenContract.balanceOf(receiver);
            assert.equal(user2Balance.toNumber(), 2, 'The caller balance has been incremented');

            // transfer the tokens out of the token sale contract
            const tokenSaleContractBalance = await tokenContract.balanceOf(tokenSaleContract.address);
            // -10 in buying process test -2 for the current rewarding process test
            assert.equal(tokenSaleContractBalance.toNumber(), tokenAvailable - 12, 'The token sale balance has been decremented');

            // successful transaction: rewarded tokens count incremented
            const tokensRewarded = await tokenSaleContract.tokensRewarded();
            assert.equal(tokensRewarded.toNumber(), 2, 'Keeps track of the number of tokens rewarded');

            // reward event
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Reward', 'the event is a "Reward"event');
            assert.equal(receipt.logs[0].args._receiver, receiver, 'logs the receiver address');
            assert.equal(receipt.logs[0].args._tokens, 2, 'logs the value transfered');
      });

      it('Ends the token sale', async () => {
            // reverts if caller is not admin
            const e = await endSale({from: user1});
            assertRevert(e, 'Requires the caller to be the admin');

            // no fund left in the token sale contract
            await endSale({from: admin});

            // check the balance of the token contract first
            const contractBalance = await tokenContract.balanceOf(tokenSaleContract.address);
            assert.equal(contractBalance.toNumber(), 0, 'the token sale contract has no fund left');

            // 1000000 - 10 (tokens bought in previous test) = 999990
            const adminBalance = await tokenContract.balanceOf(admin);
            // -10 in buying process test -2 for the previous rewarding process test
            assert.equal(adminBalance.toNumber(), 999988, 'all fund left in the token sale contract has been transfered to admin')

            ////////////////////////////////////////s
            // token price reset means sale contract successfully destroyed
            // const price = await tokenSaleContract.tokenPrice();
            // assert.equal(price.toNumber(), 0, 'token price has been reset when sale contract was destroyed');
      });
});