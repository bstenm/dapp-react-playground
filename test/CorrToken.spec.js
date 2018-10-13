const helpers = require('../testHelpers');
const CorrToken = artifacts.require('./CorrToken.sol')

const {tryCatchWrapper, assertRevert} = helpers;

contract('CorrToken', accounts => {
      let transfer, transferFrom, tokenInstance;
      const totalSupply = 1000000;

      before( async () => {
            tokenInstance = await CorrToken.deployed();
            // wrap in try catch block fn we want to test "revert" for
            transfer = tryCatchWrapper(tokenInstance.transfer.call);
            transferFrom = tryCatchWrapper(tokenInstance.transferFrom);
      })

      it( 'Initialises contract with name, symbol and standard', async () => {
            const name = await tokenInstance.name();
            const symbol = await tokenInstance.symbol();
            const standard = await tokenInstance.standard();
            assert.equal(name, 'CorrToken', 'Sets the token name');
            assert.equal(symbol, 'CORR', 'Sets the token symbol');
            assert.equal(standard, 'Corr Token v1.0', 'Sets the token standard');
      });

      it('Sets the total supply on deployment', async () => {
            const supply = await tokenInstance.totalSupply();
            assert.equal(supply.toNumber(), totalSupply, 'Caches the total suplly number');
            const adminBalance = await tokenInstance.balanceOf(accounts[0]);
            assert.equal(adminBalance.toNumber(), totalSupply, 'Sets the balance of the deployer account to the total supply');
      });

      it( 'Transfers token ownership', async () => {
            const amount = 250000;
            // reverts if amount to tranfer exceeds the total supply available
            const e = await transfer(accounts[1], totalSupply + 1);
            assertRevert(e, 'Cannot transfer amount that exceeds available');
            // successful transfer
            const result = await tokenInstance.transfer.call(accounts[1], amount);
            assert.equal(result, true, 'returns true if transfer was successful');
            // the transaction receipt log
            const receipt = await tokenInstance.transfer(accounts[1], amount, { from: accounts[0]});
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'the event is a "Transfer"event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the sending account');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receiving account');
            assert.equal(receipt.logs[0].args._value, amount, 'logs the value transfered');
            // checks the updated balance of sender and recipient
            const balance1 = await tokenInstance.balanceOf(accounts[1]);
            const balance0 = await tokenInstance.balanceOf(accounts[0]);
            assert.equal(balance1.toNumber(), amount, 'adds the amount to the receiving account');
            assert.equal(balance0.toNumber(), totalSupply - amount, 'deducts the amount from the sending account');
      });

      it( 'Approves proxy to transfer tokens on account\s behalf', async () => {
            const success = await tokenInstance.approve.call( accounts[1], 100);
            assert.equal( success, true, 'ite returns true');
            // transaction receipt logs
            const receipt = await tokenInstance.approve(accounts[1], 100);
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'the event is a "Transfer"event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the owner account');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the spender account');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the value transfered');
            // check the allowance is recorded
            const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
      });

      it( 'Handles delegate token transfer', async () => {
            let e, balance;
            const to = accounts[3];
            const from = accounts[2];
            const spender = accounts[4];
            // transfer some tokens to the from account
            await tokenInstance.transfer( from, 100, { from: accounts[0]});
            // approves spender account to spend 10 tokens from "from" account
            await tokenInstance.approve(spender, 15, { from });
            // reverts if proxy tries to transfer more tokens than we have
            e = await transferFrom( from, to, 9999, { from: spender });
            assertRevert(e, 'Cannot transfer value larger than balance');
            // reverts if proxy tries to transfer more then it is allowed
            e = await transferFrom( from, to, 16, { from: spender });
            assertRevert(e, 'Cannot transfer value larger than allowance');
            // successful transfer: check transaction receipt logs
            const receipt = await transferFrom( from, to, 9, { from: spender });
            assert.equal(receipt.logs.length, 1, 'Emits one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'Event should be Approval')
            assert.equal(receipt.logs[0].args._from, from, 'Logs the sending account')
            assert.equal(receipt.logs[0].args._to, to, 'Logs the receiving account')
            assert.equal(receipt.logs[0].args._value, 9, 'Logs the value transfered')
            // check the balance of the original account has been decreased
            balance = await tokenInstance.balanceOf(from);
            assert.equal(balance.toNumber(), 91, 'Deducts the tokens from the sending account');
            // check the balance of the receiving  account has been increased
            balance = await tokenInstance.balanceOf(to);
            assert.equal(balance.toNumber(), 9, 'Adds the tokens to the receiving account');
            // check the allowance for the proxy has been decreased
            const allowance = await tokenInstance.allowance(from, spender);
            assert.equal(allowance.toNumber(), 6, 'Deducts the tokens to the allowance');
            // check the method returns true when transaction has been successful
            const success = await tokenInstance.transferFrom.call( from, to, 5, { from: spender });
            assert.equal( success, true, 'it returns true on success');
      });
})