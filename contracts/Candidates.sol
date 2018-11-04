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
      
      /**
      * Assures only valide candidate can perform
      * actions featured in the function modified
      *
      * @param _candidate - the candidate whose validity we want to check
      */
      modifier onlyValidCandidate(bytes32 _candidate) {
            uint index = indexOfCandidate(_candidate);
            require(index != uint(-1));
            _;
      }

      /**
      * Constructor function
      *
      * @param _candidateNames - the list of valid candidates
      */
      constructor(bytes32[] _candidateNames) public {
            candidateList = _candidateNames;
      }

      /**
      * Returns the index of the candidate passed in the candidate array
      *
      * @param _candidate - the candidate to find in the array
      * @return - the index found or -1
      */
      function indexOfCandidate( bytes32 _candidate) view public returns (uint) {
            for (uint i = 0; i < candidateList.length; i++) {
                  if (candidateList[i] == _candidate) {
                        return i;
                  }
            }
            return uint(-1);
      }

      /**
      * Pushes a new item in the array of infos for a candidate
      *
      * @param _candidate - the candidate subject of the info item
      * @param _title - title of new item
      * @param _description - description of new item
      * @param _attachmentHash - the hash of the attachment associated with the new item
      * @return - true on success
      */
      function addInfo (
            bytes32 _candidate,
            bytes _title,
            bytes _description,
            bytes _attachmentHash
      ) public onlyValidCandidate(_candidate) returns (bool) {
            Item memory item;

            item.title = _title;
            item.description = _description;
            item.attachmentHash = _attachmentHash;

            candidateInfo[_candidate].push(item);

            // return true on success
            return true;
      }

      /**
      * Returns the item located at a given index in the array of infos
      *
      * @param _candidate - the candidate whose info we want to fetch
      * @param _idx - index of the item in the array of infos
      * @return (item title, item description, item attachment hash)
      */
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

      /**
      * Records the vote for a given candidate
      *
      * @param _candidate - the candidate receiving the info
      * @return - true on success
      */
      function addVoteFor(
            bytes32 _candidate
      ) public onlyValidCandidate(_candidate) returns (bool) {
            candidateVotes[_candidate] += 1;
            // return true on success
            return true;
      }
}