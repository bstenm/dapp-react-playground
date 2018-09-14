const helpers = require('../testHelpers');
const Banking = artifacts.require('./Banking.sol')
const CorrToken = artifacts.require('./CorrToken.sol')

const { tryCatchWrapper, assertRevert } = helpers;

contract( 'Banking', accounts => {
      let withdraw, deposit, loan, bankingContract, user, tokenContract, admin, startAt;

      before( async () => {
            // used to test customer creation date
            startAt = Math.round(Date.now()/1000);
            admin = accounts[0];
            user = accounts[1];
            bankingContract = await Banking.deployed();
            tokenContract = await CorrToken.deployed();
            // wrap in try catch block fn we want to test "revert" for
            loan = tryCatchWrapper(bankingContract.loan);
            deposit = tryCatchWrapper(bankingContract.deposit);
            withdraw = tryCatchWrapper(bankingContract.withdraw);
            // provision the banking contract with some tokens
            tokenContract.transfer(bankingContract.address, 250);
      })

      it('Initialises contract', async () => {
            const address1 = await bankingContract.address;
            assert.notEqual(address1, 0x0, 'Has contract address' );
            const address2 = await bankingContract.tokenContract();
            assert.notEqual(address2, 0x0, 'Has a token contract' );
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
            assert.equal(bankingContractBalance.toNumber(), 253, 'The amount of tokens has been transfered to the banking contract');
            // user bank account balance and creation date
            const [userBankBalance, createdAt] = await bankingContract.getCustomerDetails(user);
            assert.equal(userBankBalance.toNumber(), 3, 'The user bank balance has been incremented');
            assert.notEqual(createdAt.toNumber(), 0, 'The user creation date has been set');
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
            assert.equal(bankingContractBalance.toNumber(), 252, 'The amount of tokens has been decremented from the banking contract');
            // user bank account balance
            const [userBankBalance] = await bankingContract.getCustomerDetails(user);
            assert.equal(userBankBalance.toNumber(), 2, 'The user bank account has been decremented');
      });

      // LOAN: user balance is now 2
      it('Allows the user to loan some tokens', async () => {
            const e = await loan(10, { from: user });
            assertRevert(e, 'Reverts if the amount to loan exceeds the user\'s balance');

            await bankingContract.loan(2, { from: user });
            const [userBankBalance] = await bankingContract.getCustomerDetails(user);
            assert.equal(userBankBalance.toNumber(), 4, 'The loan has been added to the user\s balance');
      });

      // GET CUSTOMER DETAILS: user bank balance is now 4
      it('Allows to access a customer details', async () => {
            const [balance, createdAt, address] = await bankingContract.getCustomerDetails(user);
            assert.equal(balance.toNumber(), 4, 'Returns the customer\'s balance');
            assert.isAtLeast(createdAt.toNumber(), startAt, 'Returns the customer\'s account creation time');
      });

      it('Allows to claim interest on user balamce', async () => {
            const [balance] = await bankingContract.getCustomerDetails(user);
            // assert.equal(balance, , '');
      });
})