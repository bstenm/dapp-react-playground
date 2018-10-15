pragma solidity ^0.4.18;

import  './Users.sol';
import  './CorrToken.sol';
import  './Candidates.sol';
import  './CorrTokenSale.sol';

contract UserActions {

       Users public usersContract;
       CorrToken public tokenContract;
       Candidates public candidatesContract;
       CorrTokenSale public tokenSaleContract;

      modifier onlyRegisteredUser (bytes32 _name) {
            require(usersContract.isRegistered(_name));
            _;
      }

      function UserActions(
            CorrToken _tokenContract,
            CorrTokenSale _tokenSaleContract,
            Users _usersContract,
            Candidates _candidatesContract
      ) public {
            usersContract = _usersContract;
            tokenContract = _tokenContract;
            tokenSaleContract = _tokenSaleContract;
            candidatesContract = _candidatesContract;
      }

      function voteForCandidate(bytes32 _candidate, bytes32 _user) public onlyRegisteredUser(_user) {
            // require user has enough tokens
            require(tokenContract.balanceOf(msg.sender) >= 1);

            // record the vote for the candidate
            candidatesContract.addVoteFor(_candidate);

            // update the user voting record
            usersContract.addVoteFor(1, _user);

            // transfer one token from user back to the token sale contract
            tokenContract.transferFrom(msg.sender, tokenSaleContract, 1);
      }

      function addCandidateInfo(
            bytes32 _candidate,
            bytes _title,
            bytes _description,
            bytes _attachmentHash,
            bytes32 _user
      ) public onlyRegisteredUser(_user) {
            // calls candidates contract method
            candidatesContract.addInfo(_candidate, _title, _description, _attachmentHash);

            // transfer 2 tokens from token sale contract to the user
            tokenSaleContract.reward(msg.sender, 1);
      }
}