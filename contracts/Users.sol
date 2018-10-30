pragma solidity ^0.4.18;

import  "./CorrToken.sol";
import  "./CorrTokenSale.sol";

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

      /**
      * Constructor function
      */
      function Users (CorrToken _tokenContract, CorrTokenSale _tokenContractSale) public {
            tokenContract = _tokenContract;
            tokenSaleContract = _tokenContractSale;
      }

      /**
      * Register a user
      */
      function register() public {
            userInfo[msg.sender].userAddress = msg.sender;
            // initialises voting record array
            userInfo[msg.sender].votingRecord = [0, 0, 0];
      }

      /**
      * Checks if user already registered
      *
      * @param _address - user address
      * @return bool
      */
      function isRegistered(address _address) view public returns (bool) {
            if (userInfo[_address].userAddress == _address) {
                  return true;
            }
            return false;
      }

      /**
      * CReturns the user data recorded on the blockchain
      *
      * @param _address - user address
      * @return (uint[], address) - (user voting record, user address)
      */
      function userData(address _address) view public returns (uint[], address) {
            return (
                  userInfo[_address].votingRecord,
                  userInfo[_address].userAddress
            );
      }

      /**
      * Save the vote in the user record
      * We pass the index of the candidate in the candidate list instead
      * of her name because tuples as returned value are not supported
      *
      * @param _index - index of candidate in the candidate array
      */
      function updateVotingRecord(uint _index) public onlyRegisteredUser {
            // get one token out of user's account back into the token sale contract
            require(tokenContract.transferFrom(msg.sender, tokenSaleContract, 1));

            // then update the user's voting record
            userInfo[msg.sender].votingRecord[_index] += 1;
      }
}