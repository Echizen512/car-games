// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

contract Finance is Ownable {
    mapping(address => uint256) public balances; // Players' earnings
    mapping(address => uint256) public lastBetTime; // Betting time record

    event BetPlaced(address indexed player, uint256 amount);
    event Payout(address indexed player, uint256 amount);
    event Withdrawal(address indexed player, uint256 amount, uint256 penalty);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function placeBet() external payable {
        require(msg.value >= 5, "You must bet at least 5 units"); // Enforcing minimum bet
        balances[msg.sender] += msg.value;
        lastBetTime[msg.sender] = block.timestamp; // Store betting time

        emit BetPlaced(msg.sender, msg.value);
    }

    function resolveRace(address player, uint8 position) external {
        uint256 betAmount = balances[player]; // Amount bet by the player

        if (position == 1) {
            balances[player] += (betAmount * 110) / 100; // Winner gets a 10% bonus
        } else if (position == 2) {
            balances[player] += betAmount; // Second place keeps their bet amount
        } else if (position == 3) {
            uint256 loss = betAmount / 2;
            balances[player] += betAmount - loss; // Third place loses 50% of their bet
            balances[owner()] += loss; // The owner r()eceives the lost amount
        } else {
            balances[owner] += betAmount; // Other positions lose their full bet to the owner
        }

        emit Payout(player, balances[player]);
    }

    function withdrawEarnings() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No earnings available for withdrawal");

        uint256 timeElapsed = block.timestamp - lastBetTime[msg.sender];
        uint256 penalty = 0;

        // Withdrawal penalty system based on time elapsed
        if (timeElapsed < 24 hours) {
            penalty = (amount * 50) / 100; // 50%
        } else if (timeElapsed < 48 hours) {
            penalty = (amount * 30) / 100; // 30%
        } else if (timeElapsed < 72 hours) {
            penalty = (amount * 5) / 100; // 20%
        }

        uint256 finalAmount = amount - penalty;
        balances[msg.sender] = 0;
        balances[owner] += penalty; // The owner receives the penalty amount

        payable(msg.sender).transfer(finalAmount);

        emit Withdrawal(msg.sender, finalAmount, penalty);
    }
}
