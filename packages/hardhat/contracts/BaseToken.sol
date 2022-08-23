//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BaseToken is ERC20 {
    address public admin;


constructor (string memory name, string memory symbol) ERC20(name, symbol) {
    admin = msg.sender;
}

function updateAdmin(address newAdmin) external {
    require(msg.sender == admin, 'only admin');
    admin = newAdmin;
}

function mint (address to, uint amount) external {
    require(msg.sender == admin, 'only admin');
    _mint(to, amount);
}

function burn(address owner, uint amount) external {
    require(msg.sender == admin, 'only admin');
    _burn(owner, amount);

}
}