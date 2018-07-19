const helpers = require('../testHelpers');
const Banking = artifacts.require('./Banking.sol')
const CorrToken = artifacts.require('./CorrToken.sol')

const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Banking', accounts => {
      let withdraw, deposit, bankingContract, user, tokenContract, admin;

      before( async () => {
            admin = accounts[0];
            user = accounts[1];
            bankingContract = await Banking.deployed();
            tokenContract = await CorrToken.deployed();
            // wrap in try catch block fn we want to test "revert" for
            deposit = tryCatchWrapper(bankingContract.deposit);
            withdraw = tryCatchWrapper(bankingContract.withdraw);
      })

      it('Initialises contract', async () => {
            const address1 = await bankingContract.address;
            assert.notEqual(address1, 0x0, 'has contract address' );
            const address2 = await bankingContract.tokenContract();
            assert.notEqual(address2, 0x0, 'has a token contract' );
      });

      // DEPOSIT
      it('Allows the user to deposit tokens', async () => {
            // first let us transfer some token to this user
            await tokenContract.transfer(user, 5, { from: admin });
            // and allow banking contract to transfer those tokens on our behalf
            await tokenContract.approve(bankingContract.address, 5, { from: user });
            // try to deposit into bank account
            const e = await deposit(8, { from: user });
            assertRevert(e, 'Reverts if the value passed exceeds the amount the user has');

            await bankingContract.deposit(3, { from: user });
            // user balance
            const userBalance = await tokenContract.balanceOf(user);
            assert.equal(userBalance.toNumber(), 2, 'The amount of tokens the user has has been decremented');
            // banking contract balance
            const bankingContractBalance = await tokenContract.balanceOf(bankingContract.address);
            assert.equal(bankingContractBalance.toNumber(), 3, 'The amount of tokens has been transfered to the banking contract');
            // user bank account balance
            const userBankBalance = await bankingContract.balanceOf(user);
            assert.equal(userBankBalance.toNumber(), 3, 'The user bank account has been incremented');
      });

      // WITHDRAW: user has now 3 tokens in his bank account
      it('Allows the user to withdraw from her account', async () => {
            const e = await withdraw(4, { from: user });
            assertRevert(e, 'Reverts if the amount to withdraw exceeds the user\'s balance');

            await bankingContract.withdraw(1, { from: user });
            // user balance
            const userBalance = await tokenContract.balanceOf(user);
            assert.equal(userBalance.toNumber(), 3, 'The amount of tokens the user has has been incremented');
            // banking contract balance
            const bankingContractBalance = await tokenContract.balanceOf(bankingContract.address);
            assert.equal(bankingContractBalance.toNumber(), 2, 'The amount of tokens has been decremented from the banking contract');
            // user bank account balance
            const userBankBalance = await bankingContract.balanceOf(user);
            assert.equal(userBankBalance.toNumber(), 2, 'The user bank account has been decremented');
      });
})