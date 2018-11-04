pragma solidity ^0.4.2;

import  './CorrToken.sol';

contract CorrTokenSale {
      address admin;
      uint256 public tokenPrice;
      uint256 public tokensSold;
      uint256 public tokensRewarded;
      CorrToken public tokenContract;

      event Sale(
            address indexed _buyer,
            uint256 _value
      );

      event Reward(
            address indexed _receiver,
            uint256 _tokens
      );

      /**
      * Constructor function
      */
      constructor(CorrToken _tokenContract, uint256 _tokenPrice) public {
            admin = msg.sender;
            tokenPrice = _tokenPrice;
            tokenContract = _tokenContract;
      }

      /**
      * Safe multiplication of uint
      *
      */
      function mul(uint _x, uint _y) internal pure returns (uint z) {
            require(_y == 0 || (z = _x * _y) / _y == _x);
      }

      /**
      * Transfer tokens to a buyer
      *
      * @param _numberOfTokens - number of tokens being purchased
      * @return - true on success
      */
      function buy(uint256 _numberOfTokens) public payable returns (bool) {
            // require the value corresponds to nb of tokens
            require(msg.value == mul(_numberOfTokens, tokenPrice));

            // require we have enough tokens in the contract
            require(tokenContract.balanceOf(this) >= _numberOfTokens);

            // transfer the amount of tokens to buyer
            require(tokenContract.transfer(msg.sender, _numberOfTokens));

            // keep track of tokens sold
            tokensSold += _numberOfTokens;

            // trigger sale event
            emit Sale(msg.sender, msg.value);

            // return true on success
            return true;
      }

      /**
      * Transfer tokens to a user for free
      *
      * @param _receiver - the address to receive the free tokens
      * @param _numberOfTokens - number of tokens being given away
      * @return - true on success
      */
      function reward(address _receiver, uint256 _numberOfTokens) public returns (bool) {
            // require we have enough tokens in the contract
            require(tokenContract.balanceOf(this) >= _numberOfTokens);

            // transfer the tokens to the caller
            require(tokenContract.transfer(_receiver, _numberOfTokens));

            // keep track of tokens rewarded
            tokensRewarded += _numberOfTokens;

            // trigger Reward event
            emit Reward(_receiver, _numberOfTokens);

            // return true on success
            return true;
      }

      /**
      * Transfer all the tokens this contract hold back to the admin account
      */
      function endSale() public  {
            require(msg.sender == admin);
            require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
            // [TODO]: why throws an error when running tests ?
            // selfdestruct(admin);
      }
}