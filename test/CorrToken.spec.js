const helpers = require('../testHelpers');
const CorrToken = artifacts.require('./CorrToken.sol')

const { tryCatchWrapper, assertRevert } = helpers;

contract( 'CorrToken', accounts => {
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
            expect( name ).to.equal( 'CorrToken' );
            expect( symbol ).to.equal( 'CORR' );
            expect( standard ).to.equal( 'Corr Token v1.0' );
      });

      it('Sets the total supply upon deployment', async () => {
            const supply = await tokenInstance.totalSupply();
            expect( supply.toNumber() ).to.equal( totalSupply )
            const adminBalance = await tokenInstance.balanceOf( accounts[ 0 ]);
            expect( adminBalance.toNumber() ).to.equal( totalSupply )
      });

      it( 'Transfers token ownership', async () => {
            const amount = 250000;

            const e = await transfer(accounts[1], totalSupply + 1);
            assertRevert(e, 'Cannot transfer amount that exceeds available');

            const result = await tokenInstance.transfer.call(accounts[1], amount);
            assert.equal( result, true, 'returns true if transfer was successful');

            const receipt = await tokenInstance.transfer(accounts[1], amount, { from: accounts[0]});
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'the event is a "Transfer"event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the sending account');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receiving account');
            assert.equal(receipt.logs[0].args._value, amount, 'logs the value transfered');

            const balance1 = await tokenInstance.balanceOf(accounts[1]);
            const balance0 = await tokenInstance.balanceOf(accounts[0]);
            assert.equal(balance1.toNumber(), amount, 'adds the amount to the receiving account');
            assert.equal(balance0.toNumber(), totalSupply - amount, 'deducts the amount from the sending account');
      });

      it( 'Approves tokens for delegated transfer', async () => {
            const success = await tokenInstance.approve.call( accounts[1], 100);
            assert.equal( success, true, 'ite returns true');

            const receipt = await tokenInstance.approve(accounts[1], 100);
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'the event is a "Transfer"event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the owner account');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the spender account');
            assert.equal(receipt.logs[0].args._value, 100, 'logs the value transfered');

            const allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
      });

      it( 'Handles delegate token transfer', async () => {
            let e, balance;
            const to = accounts[3];
            const from = accounts[2];
            const spending = accounts[4];

            // transfer some tokens to the from account
            await tokenInstance.transfer( from, 100, { from: accounts[0]});
            // approves spending account to spend 10 tokens from "from" account
            await tokenInstance.approve(spending, 15, { from });

            e = await transferFrom( from, to, 9999, { from: spending });
            assertRevert(e, 'Cannot transfer value larger than balance');

            e = await transferFrom( from, to, 16, { from: spending });
            assertRevert(e, 'Cannot transfer value larger than allowance');

            const receipt = await transferFrom( from, to, 9, { from: spending });
            assert.equal(receipt.logs.length, 1, 'Emits one event')
            assert.equal(receipt.logs[0].event, 'Transfer', 'Event should be Approval')
            assert.equal(receipt.logs[0].args._from, from, 'Logs the sending account')
            assert.equal(receipt.logs[0].args._to, to, 'Logs the receiving account')
            assert.equal(receipt.logs[0].args._value, 9, 'Logs the value transfered')

            balance = await tokenInstance.balanceOf(from);
            assert.equal(balance.toNumber(), 91, 'Deducts the tokens from the sending account');

            balance = await tokenInstance.balanceOf(to);
            assert.equal(balance.toNumber(), 9, 'Adds the tokens to the receiving account');

            const allowance = await tokenInstance.allowance(from, spending);
            assert.equal(allowance.toNumber(), 6, 'Deducts the tokens to the allowance');

            const success = await tokenInstance.transferFrom.call( from, to, 5, { from: spending });
            assert.equal( success, true, 'it returns true on success');
      });
})