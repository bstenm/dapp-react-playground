pragma solidity ^0.4.18;

contract Candidates {

      struct Item {
            bytes32 description;
            bytes32 attachment;
      }

      mapping(bytes32 => Item[]) public candidateInfo;

      bytes32[] public candidateList;

      function Candidates(bytes32[] _candidateNames) public {
            candidateList = _candidateNames;
      }

      function addInfo (bytes32 _candidate, bytes32 _description, bytes32 _attachment) public {
            uint index = indexOfCandidate(_candidate);
            // require valid candidate
            require(index != uint(-1));
            Item memory item;
            item.description = _description;
            item.attachment = _attachment;
            candidateInfo[_candidate].push(item);
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