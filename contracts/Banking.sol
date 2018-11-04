pragma solidity ^0.4.2;

import  './CorrToken.sol';

contract Banking {
      struct Customer {
            uint256 balance;
            uint256 createdAt;
            address myAddress;
      }

      address owner;
      CorrToken public tokenContract;
      mapping(address => Customer) public customerInfo;

      /**
      * Constructor
      *
      * @param _tokenContract - the contract describing the Corr token
      */
      constructor(CorrToken _tokenContract) public {
            tokenContract = _tokenContract;
      }

      /**
      * Transfer tokens from user account to this contract
      *
      * @param _amount - number of tokens to deposit
      * @return - true on success
      */
      function deposit(uint _amount)  public payable returns (bool) {
            address customer = msg.sender;

            require(tokenContract.balanceOf(msg.sender) >= _amount);
            require(tokenContract.transferFrom(msg.sender, this, _amount));

            // increase the customer blance
            customerInfo[customer].balance += _amount;

            // set account creation date if not set yet
            if (customerInfo[customer].createdAt == 0) {
                  customerInfo[customer].createdAt = now;
            }

            // return true on success
            return true;
      }

      /**
      * Transfer tokens from this contract to a given user
      *
      * @param _amount - number of tokens being withdrawn
      * @return - true on success
      */
      function withdraw(uint _amount) public  returns (bool) {
            require(customerInfo[msg.sender].balance >= _amount);
            require(tokenContract.transfer(msg.sender, _amount));

            // decrease customer's account
            customerInfo[msg.sender].balance -= _amount;

            // return true on success
            return true;
      }

      /**
      * Transfer token to a given user as loan
      *
      * @param _amount - number of tokens to transfer
      * @return - true on success
      */
      function loan(uint _amount) public  returns (bool) {
            // can not loan more than current balance
            require(customerInfo[msg.sender].balance >= _amount);

            // increase the customer's account
            customerInfo[msg.sender].balance += _amount;

            // return true on success
            return true;
      }

      /**
      * Returns the user details
      *
      * @param _customer - address of user
      * @return (balance, date of account creation, address of customer)
      */
      function getCustomerDetails(address _customer) view public returns (uint256, uint256, address) {
            return (
                  customerInfo[_customer].balance,
                  customerInfo[_customer].createdAt,
                  customerInfo[_customer].myAddress
            );
      }
}