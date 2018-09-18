pragma solidity ^0.4.18;

import  './CorrToken.sol';

contract Voting {

      struct Voter {
            address voterAddress;
            uint[] votingRecord;
            bytes32 name;
      }

      mapping(bytes32 => uint) public votesReceived;
      mapping(bytes32 => Voter) public voterInfo;

      bytes32[] public candidateList;
      address[] public voterAddresses;
       CorrToken public tokenContract;

      function Voting(CorrToken _tokenContract, bytes32[] _candidateNames ) public {
            candidateList = _candidateNames;
            tokenContract = _tokenContract;
      }

      function registerVoter(bytes32 _name) public {
            voterInfo[_name].name = _name;
            voterInfo[_name].voterAddress = msg.sender;
            // initialises voting record array
            voterInfo[_name].votingRecord = [0, 0, 0];
            // to be used for ganache only: keep track of addresses in use
            voterAddresses.push(msg.sender);
      }

      function getVoterAddresses() view public returns (address[]) {
            return voterAddresses;
      }

      function voterDetails(bytes32 _name) view public returns (uint[], address, bytes32) {
            return (
                  voterInfo[_name].votingRecord,
                  voterInfo[_name].voterAddress,
                  voterInfo[_name].name
            );
      }

      function unregisterVoter(bytes32 _name) public {
            delete voterInfo[_name];
      }

      function totalVotesFor(bytes32 _candidate) view public returns (uint) {
            uint index = indexOfCandidate(_candidate);
            require(index != uint(-1));
            return votesReceived[_candidate];
      }

      function voteForCandidate(bytes32 _candidate, bytes32 _name) public {
            uint index = indexOfCandidate(_candidate);
            // require valid candidate
            require(index != uint(-1));
            // require user is registered
            require(voterInfo[_name].name == _name);
            // require user has enough tokens
            require(tokenContract.balanceOf(msg.sender) >= 1);
            // increment vote count for this candidate
            votesReceived[_candidate] += 1;
            // update the user voting record
            voterInfo[_name].votingRecord[index] += 1;
            // transfer one token from user to this contract
            tokenContract.transferFrom(msg.sender, this, 1);
      }

      function indexOfCandidate( bytes32 _candidate) view public returns (uint) {
            for (uint i = 0; i < candidateList.length; i++) {
                  if (candidateList[i] == _candidate) {
                        return i;
                  }
            }
            return uint(-1);
      }
}