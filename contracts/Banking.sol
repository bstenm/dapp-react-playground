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
      * @param _tokenContract
      */
      function Banking (CorrToken _tokenContract) public {
            tokenContract = _tokenContract;
      }

      /**
      * Transfer tokens from user account to this contract
      *
      * @param _amount - number of tokens to deposit
      */
      function deposit (uint _amount)  public payable {
            address customer = msg.sender;
            require(tokenContract.balanceOf(msg.sender) >= _amount);
            require(tokenContract.transferFrom(msg.sender, this, _amount));
            customerInfo[customer].balance += _amount;
            // set account creation date if not set yet
            if (customerInfo[customer].createdAt == 0) {
                  customerInfo[customer].createdAt = now;
            }
      }

      /**
      * Transfer tokens from this contract to a given user
      *
      * @param _amount - number of tokens being withdrawn
      */
      function withdraw (uint _amount) public {
            require(customerInfo[msg.sender].balance >= _amount);
            require(tokenContract.transfer(msg.sender, _amount));
            customerInfo[msg.sender].balance -= _amount;
      }

      /**
      * Transfer token to a given user as loan
      *
      * @param _amount - number of tokens to transfer
      */
      function loan (uint _amount) public {
            // can not loan more than current balance
            require(customerInfo[msg.sender].balance >= _amount);
            customerInfo[msg.sender].balance += _amount;
      }

      /**
      * Returns the user details
      *
      * @param _customer - address of user
      * @return (balance, date of account creation, address of customer)
      */
      function getCustomerDetails (address _customer) view public returns (uint256, uint256, address) {
            return (
                  customerInfo[_customer].balance,
                  customerInfo[_customer].createdAt,
                  customerInfo[_customer].myAddress
            );
      }
}