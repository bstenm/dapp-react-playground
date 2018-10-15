pragma solidity ^0.4.18;

import  './CorrToken.sol';

contract Users {

      struct User {
            address userAddress;
            uint[] votingRecord;
            bytes32 name;
      }

      mapping(bytes32 => User) public userInfo;

      address[] public userAddresses;

      modifier onlyRegisteredUser (bytes32 name) {
            require(isRegistered(name));
            _;
      }

      function registerUser(bytes32 _name) public {
            userInfo[_name].name = _name;
            userInfo[_name].userAddress = msg.sender;
            // initialises voting record array
            userInfo[_name].votingRecord = [0, 0, 0];
            // to be used for ganache only: keep track of addresses in use
            userAddresses.push(msg.sender);
      }

      function isRegistered(bytes32 _name) view public returns (bool) {
            if (userInfo[_name].name == _name) {
                  return true;
            }
            return false;
      }

      function userData(bytes32 _name) view public returns (uint[], address, bytes32) {
            return (
                  userInfo[_name].votingRecord,
                  userInfo[_name].userAddress,
                  userInfo[_name].name
            );
      }

      // we pass the index of the candidate in the candidate list
      // instead of her name because we can not return tuples
      function addVoteFor(uint _index, bytes32 _name) public onlyRegisteredUser(_name) {
            userInfo[_name].votingRecord[_index] += 1;
      }
}