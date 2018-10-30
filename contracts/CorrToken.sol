pragma solidity ^0.4.17;

contract CorrToken {
      string public name = "CorrToken";
      string public symbol = "CORR";
      string public standard = "Corr Token v1.0";
      uint256 public totalSupply;

      mapping(address => uint256) public balanceOf;
      mapping(address => mapping(address => uint256)) public allowance;

      event Transfer (
            address indexed _from,
            address indexed _to,
            uint256 _value
      );

      event Approval (
            address indexed _owner,
            address indexed _spender,
            uint256 _value
      );

      event Instanciation (
            address indexed _owner
      );

      /**
      * Constructor
      */
      function CorrToken (uint256 _initialSupply) public {
            balanceOf[msg.sender] = _initialSupply;
            totalSupply = _initialSupply;
            Instanciation(msg.sender);
      }

      /**
      * Transfer tokens from an addres to another
      *
      * @param _to - address to receive the tokens
      * @param _value - the number of tokens to transfer
      * @return bool
      */
      function transfer(address _to, uint256 _value) public returns (bool success) {
            require(balanceOf[msg.sender] >= _value);
            // update both account balances
            balanceOf[msg.sender] -= _value;
            balanceOf[_to] += _value;

            Transfer(msg.sender, _to, _value);

            return true;
      }

      /**
      * Allows an account to spend a given number
      * of tokens on behalf of another account
      *
      * @param _spender - the account to receive the allowance
      * @param _value - the number of tokens the account is allwoed to spend
      * @return bool
      */
      function approve(address _spender, uint256 _value) public returns (bool success) {
            allowance[msg.sender][_spender] = _value;
            Approval(msg.sender, _spender, _value);
            return true;
      }

      /**
      * Transfer tokens from an account to another
      *
      * @param _from - the account spending the tokens
      * @param _to - the account to receive the tokens
      * @param _value - the number of tokens to transfer
      * @return bool
      */
      function transferFrom (address _from, address _to, uint256 _value) public returns (bool success) {
            require(balanceOf[_from] >= _value);
            require(allowance[_from][msg.sender] >= _value);
            // emit event
            Transfer(_from, _to, _value);
            // update account balances
            balanceOf[_from] -= _value;
            balanceOf[_to] += _value;
            // substract from allowance
            allowance[_from][msg.sender] -= _value;
            // returns true on success
            return true;
      }
}