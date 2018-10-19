pragma solidity ^0.4.18;

import  './CorrToken.sol';
import  './CorrTokenSale.sol';

contract Users {

      struct User {
            address userAddress;
            uint[] votingRecord;
      }

      mapping(address => User) public userInfo;

      CorrToken public tokenContract;
      CorrTokenSale public tokenSaleContract;

      modifier onlyRegisteredUser () {
            require(isRegistered(msg.sender));
            _;
      }

      function Users (CorrToken _tokenContract, CorrTokenSale _tokenContractSale) public {
            tokenContract = _tokenContract;
            tokenSaleContract = _tokenContractSale;
      }

      function register() public {
            userInfo[msg.sender].userAddress = msg.sender;
            // initialises voting record array
            userInfo[msg.sender].votingRecord = [0, 0, 0];
      }

      function isRegistered(address _address) view public returns (bool) {
            if (userInfo[_address].userAddress == _address) {
                  return true;
            }
            return false;
      }

      function userData(address _address) view public returns (uint[], address) {
            return (
                  userInfo[_address].votingRecord,
                  userInfo[_address].userAddress
            );
      }

      // we pass the index of the candidate in the candidate list
      // instead of her name because we can not return tuples
      function updateVotingRecord(uint _index) public onlyRegisteredUser {
            // get one token out of user's account back into the token sale contract
            require(tokenContract.transferFrom(msg.sender, tokenSaleContract, 1));

            // then update the user's voting record
            userInfo[msg.sender].votingRecord[_index] += 1;
      }
}