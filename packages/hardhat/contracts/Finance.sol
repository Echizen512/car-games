// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Finance is Ownable {
    IERC20 public ronKeToken;

    //TODO: Change this

    struct Dios {
        uint256 currentOil;
        bool exist;
    }
    
    mapping(uint id => Dios) public nftOil;

    // struct Reward {
    //     uint256 amount;
    //     uint256 timestamp;
    // }

    // mapping(address =>  Reward[]) public rewards;

    //events
    event RaceStarted(address indexed player);
    event RewardGiven(address indexed player, uint256 amount);
    event Withdrawal(address indexed player, uint256 amount, uint256 penalty);

    constructor(address initialOwner, address _ronKeToken) Ownable(initialOwner) {
        ronKeToken = IERC20(_ronKeToken);
    }

    function startRace() external {
        emit RaceStarted(msg.sender);
    }

    function getOil(uint256 _nftId) public view returns (Dios memory)  {
        return nftOil[_nftId];
    }

    // function grantReward(address player, uint8 position) external onlyOwner {
    //     uint256 rewardAmount;

    //     if (position == 1) {
    //         rewardAmount = 8 * 10**18; // 8 RKS
    //     } else if (position == 2) {
    //         rewardAmount = 5 * 10**18; // 5 RKS
    //     } else if (position == 3) {
    //         rewardAmount = 3 * 10**18; // 3 RKS
    //     } else {
    //         rewardAmount = 0; // No reward for fourth place or beyond
    //     }

    //     require(rewardAmount > 0, "No reward for this position");
    //     require(ronKeToken.balanceOf(address(this)) >= rewardAmount, "Insufficient funds in contract");

    //     rewards[player].push(Reward(rewardAmount, block.timestamp));
    //     ronKeToken.transfer(player, rewardAmount);

    //     emit RewardGiven(player, rewardAmount);
    // }

    // function withdrawEarnings() external {
    //     uint256 totalAmount = 0;
    //     uint256 penalty = 0;
    //     uint256 currentTime = block.timestamp;

    //     // Calculate earnings and penalties based on elapsed time
    //     for (uint256 i = 0; i < rewards[msg.sender].length; i++) {
    //         uint256 timeElapsed = currentTime - rewards[msg.sender][i].timestamp;
    //         uint256 amount = rewards[msg.sender][i].amount;

    //         if (timeElapsed < 24 hours) {
    //             penalty += (amount * 50) / 100; // 50% penalty
    //         } else if (timeElapsed < 48 hours) {
    //             penalty += (amount * 30) / 100; // 30% penalty
    //         } else if (timeElapsed < 72 hours) {
    //             penalty += (amount * 20) / 100; // 20% penalty
    //         }

    //         totalAmount += amount;
    //     }

    //     require(totalAmount > 0, "No earnings available for withdrawal");
    //     uint256 finalAmount = totalAmount - penalty;

    //     rewards[msg.sender] = new Reward[](0); // Clear user's earnings history
    //     ronKeToken.transfer(owner(), penalty); // Transfer penalty amount to contract owner
    //     ronKeToken.transfer(msg.sender, finalAmount);

    //     emit Withdrawal(msg.sender, finalAmount, penalty);
    // }
}
