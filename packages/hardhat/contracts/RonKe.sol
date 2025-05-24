// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract RonKe is ERC20, ERC20Burnable, ERC20Permit {
    constructor(address recipient) ERC20("RonKe", "RKS") ERC20Permit("RonKe") {
        _mint(recipient, 1000000000 * 10 ** decimals());
    }
}