pragma solidity ^0.4.18;

contract Candidates {

      struct Item {
            bytes title;
            bytes description;
            bytes attachmentHash;
      }

      mapping(bytes32 => Item[]) public candidateInfo;

      bytes32[] public candidateList;

      function Candidates(bytes32[] _candidateNames) public {
            candidateList = _candidateNames;
      }

      function addInfo (
            bytes32 _candidate,
            bytes _title,
            bytes _description,
            bytes _attachmentHash
      ) public {
            uint index = indexOfCandidate(_candidate);
            // require valid candidate
            require(index != uint(-1));
            Item memory item;
            item.title = _title;
            item.description = _description;
            item.attachmentHash = _attachmentHash;
            candidateInfo[_candidate].push(item);
      }

      function getInfo (bytes32 _candidate, uint _idx) view public returns (bytes, bytes, bytes) {
            uint index = indexOfCandidate(_candidate);
            // require valid candidate
            require(index != uint(-1));
            Item[] memory items = candidateInfo[_candidate];
            if (_idx >= items.length) {
                  return;
            }
            Item memory item = items[_idx];
            return (
                  item.title,
                  item.description,
                  item.attachmentHash
            );
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