pragma solidity ^0.4.2;

import  './CorrToken.sol';

contract CorrTokenSale {
      address admin;
      uint256 public tokenPrice;
      uint256 public tokensSold;
      CorrToken public tokenContract;

      event Sale(
            address indexed _buyer,
            uint256 _value
      );

      function CorrTokenSale(CorrToken _tokenContract, uint256 _tokenPrice) public {
            admin = msg.sender;
            tokenPrice = _tokenPrice;
            tokenContract = _tokenContract;
      }

      function mul(uint _x, uint _y) internal pure returns (uint z) {
            require(_y == 0 || (z = _x * _y) / _y == _x);
      }

      function buy(uint256 _numberOfTokens) public payable {
            // require the value corresponds to nb of tokens
            require(msg.value == mul(_numberOfTokens, tokenPrice));
            // require we have enough tokens in the contract
            require(tokenContract.balanceOf(this) >= _numberOfTokens);
            // transfer the amount of tokens to buyer
            require(tokenContract.transfer(msg.sender, _numberOfTokens));
            // keep track of tokens sold
            tokensSold += _numberOfTokens;
            // Trigger sale event
            Sale(msg.sender, msg.value);
      }

      function endSale() public  {
            require(msg.sender == admin);
            require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
            // [TODO]: why throws an error when running tests ?
            // selfdestruct(admin);
      }
}