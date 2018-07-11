const helpers = require('../testHelpers');
const CorrToken = artifacts.require('./CorrToken.sol');
const CorrTokenSale = artifacts.require('./CorrTokenSale.sol');

const { tryCatchWrapper, assertRevert } = helpers;

contract( 'CorrTokenSale', accounts => {
      let buy, endSale;
      let tokenInstance;
      let buyTokensRevert;
      let tokenSaleInstance;

      const admin = accounts[0];
      const tokenPrice = 1000000000;
      const tokenAvailable = 750000;

      before( async () => {
            tokenInstance = await CorrToken.deployed();
            tokenSaleInstance = await CorrTokenSale.deployed();
            // wrap in try catch block fn we want to test "revert" for
            buy = tryCatchWrapper(tokenSaleInstance.buy);
            endSale = tryCatchWrapper(tokenSaleInstance.endSale);
            // transfer some tokens to the token sale contract
            await tokenInstance.transfer(tokenSaleInstance.address, tokenAvailable, {from: admin});
      });

      it( 'Initialiases contract with correct values', async () => {
            const address1 = await tokenSaleInstance.address;
            assert.notEqual(address1, 0x0, 'has contract address' );
            const address2 = await tokenSaleInstance.tokenContract();
            assert.notEqual(address2, 0x0, 'has a token contract' );
            const price = await tokenSaleInstance.tokenPrice();
            assert.equal(price, tokenPrice, 'token price is set');
      });

      it( 'Allows token buying process:', async () => {
            let e, receipt, anount;
            const nbOfTokens = 10;
            const buyer = accounts[1];
            const value = nbOfTokens * tokenPrice;

            e = await buy(nbOfTokens, {from: buyer, value: 1});
            assertRevert(e, 'Cannot buy nb of tokens if value is under the right price');
            e = await buy(nbOfTokens, {from: buyer, value: value + 1});
            assertRevert(e, 'Cannot buy nb of tokens if value exceeds right price');

            e = await buy(tokenAvailable + 1, {from: buyer, value: (tokenAvailable + 1) * tokenPrice});
            assertRevert(e, 'Cannot buy if not enough tokens availlable in the sale contract');

            receipt = await buy(nbOfTokens, {from: buyer, value});

            amount = await tokenInstance.balanceOf(buyer);
            assert.equal(amount.toNumber(), nbOfTokens, 'Transfer the amount to the buyer');

            amount = await tokenInstance.balanceOf(tokenSaleInstance.address);
            assert.equal(amount.toNumber(), tokenAvailable - nbOfTokens, 'Deducts the amount from the token sale contract');

            amount = await tokenSaleInstance.tokensSold();
            assert.equal(amount.toNumber(), nbOfTokens, 'Keeps track of the tokens sold');

            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sale', 'the event is a "Sale"event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the buyer address');
            assert.equal(receipt.logs[0].args._value.toNumber(), value, 'logs the value transfered');
      });

      it('Ends the token sale', async () => {
            let e;
            e = await endSale({from: accounts[1]});
            assertRevert(e, 'Requires the caller to be the admin');
            // no fund left in the token sale contract
            e = await endSale({from: accounts[0]});
            const balance1 = await tokenInstance.balanceOf(tokenSaleInstance.address);
            assert.equal(balance1.toNumber(), 0, 'the token sale contract has no fund left');
            // 1000000 - 10 (tokens bought in previous test) = 999990
            const balance2 = await tokenInstance.balanceOf(admin);
            assert.equal(balance2.toNumber(), 999990, 'all fund left in the token sale contract has been transfered to admin')
            // token price reset means sale contract successfully destroyed
            const price = await tokenSaleInstance.tokenPrice();
            assert.equal(price.toNumber(), 0, 'token price has been reset when sale contract was destroyed');
      });
});