pragma solidity ^0.4.18;

contract Candidates {

      struct Item {
            bytes title;
            bytes description;
            bytes attachmentHash;
      }

      bytes32[] public candidateList;
      mapping(bytes32 => uint) public candidateVotes;
      mapping(bytes32 => Item[]) public candidateInfo;

      modifier onlyValidCandidate(bytes32 _candidate) {
            uint index = indexOfCandidate(_candidate);
            require(index != uint(-1));
            _;
      }

      function Candidates(bytes32[] _candidateNames) public {
            candidateList = _candidateNames;
      }

      function indexOfCandidate( bytes32 _candidate) view public returns (uint) {
            for (uint i = 0; i < candidateList.length; i++) {
                  if (candidateList[i] == _candidate) {
                        return i;
                  }
            }
            return uint(-1);
      }

      function addInfo (
            bytes32 _candidate,
            bytes _title,
            bytes _description,
            bytes _attachmentHash
      ) public onlyValidCandidate(_candidate) {
            Item memory item;
            item.title = _title;
            item.description = _description;
            item.attachmentHash = _attachmentHash;
            candidateInfo[_candidate].push(item);
      }

      function getCandidateInfoAt (bytes32 _candidate, uint _idx) view public returns (bytes, bytes, bytes) {
            if (candidateInfo[_candidate].length <= _idx) {
                  return;
            }
            return (
                  candidateInfo[_candidate][_idx].title,
                  candidateInfo[_candidate][_idx].description,
                  candidateInfo[_candidate][_idx].attachmentHash
            );
      }

      function addVoteFor(bytes32 _candidate) public onlyValidCandidate(_candidate) {
            candidateVotes[_candidate] += 1;
      }
}