pragma solidity ^0.4.2;

import  './CorrToken.sol';

contract Banking {
      address owner;
      mapping(address => uint256) public balanceOf;
      CorrToken public tokenContract;

      function Banking (CorrToken _tokenContract) public {
            tokenContract = _tokenContract;
      }

      function deposit (uint amount)  public payable {
            require(tokenContract.balanceOf(msg.sender) >= amount);
            require(tokenContract.transferFrom(msg.sender, this, amount));
            balanceOf[msg.sender] += amount;
      }

      function withdraw (uint amount) public {
            require(balanceOf[msg.sender] >= amount);
            require(tokenContract.transfer(msg.sender, amount));
            balanceOf[msg.sender] -= amount;
      }
}