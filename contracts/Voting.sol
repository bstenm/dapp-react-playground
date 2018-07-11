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

      function registerVoter(bytes32 name) public {
            voterInfo[name].name = name;
            voterInfo[name].voterAddress = msg.sender;
            // initialises voting record array
            voterInfo[name].votingRecord = [0, 0, 0];
            // to be used for ganache only: keep track of addresses in use
            voterAddresses.push(msg.sender);
      }

      function getVoterAddresses() view public returns (address[]) {
            return voterAddresses;
      }

      function voterDetails(bytes32 name) view public returns (uint[], address, bytes32) {
            return (
                  voterInfo[name].votingRecord,
                  voterInfo[name].voterAddress,
                  voterInfo[name].name
            );
      }

      function unregisterVoter(bytes32 name) public {
            delete voterInfo[name];
      }

      ///////////////////////////////////////////////////
      // function buyTokens(bytes32 name) payable public returns (uint) {
      //       uint tokensToBuy = msg.value/tokenPrice;
      //       // require value not over nb of tokens available
      //       require(tokensToBuy <= tokensAvailable);
      //       // require user has a address set (registered)
      //       require(voterInfo[name].voterAddress != 0x00);
      //       voterInfo[name].tokensAvailable += tokensToBuy;
      //       tokensAvailable -= tokensToBuy;
      //       return tokensToBuy;
      // }

      function totalVotesFor(bytes32 candidate) view public returns (uint) {
            uint index = indexOfCandidate(candidate);
            require(index != uint(-1));
            return votesReceived[candidate];
      }

      function voteForCandidate(bytes32 candidate, bytes32 name) public {
            uint index = indexOfCandidate(candidate);
            // require valid candidate
            require(index != uint(-1));
            // require user has enough tokens
            require(tokenContract.balanceOf(msg.sender) >= 1);
            // increment vote count for this candidate
            votesReceived[candidate] += 1;
            // decrement the nb of tkoen available by this user
            tokenContract.transferFrom(msg.sender, this, 1);
            // update the user voting record
            voterInfo[name].votingRecord[index] += 1;
      }

      function indexOfCandidate( bytes32 candidate) view public returns (uint) {
            for (uint i = 0; i < candidateList.length; i++) {
                  if (candidateList[i] == candidate) {
                        return i;
                  }
            }
            return uint(-1);
      }
}