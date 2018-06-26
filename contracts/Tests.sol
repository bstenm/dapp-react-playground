pragma solidity ^0.4.0;

interface Regulator {
    function checkValue(uint amount) public returns (bool);
    function loan() public returns (bool);
}

contract Bank is Regulator {
      uint private value;
      address private owner;

      modifier onlyOwner {
            require(owner == msg.sender);
            _;
      }

      function Bank(uint amount) public {
            value = amount;
            owner = msg.sender;
      }

      function deposit(uint amount) public onlyOwner {
            value += amount;
      }

      function withdraw(uint amount) public onlyOwner {
            require(checkValue(amount));
            value -= amount;
      }

      function balance() view public returns (uint) {
            return value;
      }

      function checkValue(uint amount) public returns (bool) {
            return amount <= value;
      }

      function loan() public returns (bool) {
            return value >= 0;
      }
}

contract MyFirstContract is Bank(10) {

    string private name;
    uint private age;

    function setName(string newName) public {
        name = newName;
    }

    function getName() view public returns (string) {
        return name;
    }

    function setAge(uint newAge) public {
        age = newAge;
    }

    function getAge() view public returns (uint){
        return age;
    }
}