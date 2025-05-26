// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Finance is Ownable {
    IERC20 public ronKeToken;

    bytes32 public constant COMMON = "COMMON";
    bytes32 public constant UNCOMMON = "UNCOMMON";
    bytes32 public constant RARE = "RARE";
    bytes32 public constant EPIC = "EPIC";

    mapping(uint256 => uint256) public oilBalances;
    mapping(uint256 => address) public nftOwner;
    mapping(address => mapping(uint256 => Reward)) public rewards;
    mapping(address => uint256) public rewardCount;
    mapping(uint256 => Reward[]) public nftRewards;

    uint256 public maxId;

    //events
    event RaceStarted(address indexed player, uint256 nftId);
    event RewardGiven(address indexed player, uint256 amount);
    event Withdrawal(address indexed player, uint256 amount, uint256 penalty);

    struct Reward {
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }

    //constructor
    constructor(address owner, address _ronKeToken) Ownable(owner) {
        ronKeToken = IERC20(_ronKeToken);
    }

    function setDefaultOil(uint256 _nftID, bytes32 _rarity) private {
        require(_rarity == COMMON || _rarity == UNCOMMON || _rarity == RARE || _rarity == EPIC, "Wrong rarity");

        if (_rarity == COMMON) {
            oilBalances[_nftID] = 30;
        }
        if (_rarity == UNCOMMON) {
            oilBalances[_nftID] = 45;
        }
        if (_rarity == RARE) {
            oilBalances[_nftID] = 60;
        }
        if (_rarity == EPIC) {
            oilBalances[_nftID] = 75;
        }
    }

    function raceStart(uint256 _nftID, bytes32 _rarity) public {
        address player = msg.sender;
        if (nftOwner[_nftID] == address(0)) {
            setDefaultOil(_nftID, _rarity);
            nftOwner[_nftID] = player;
            oilBalances[_nftID] -= 15;
            maxId++;
        } else {
            nftOwner[_nftID] = player;
            uint256 currentOil = oilBalances[_nftID];
            require(currentOil > 0, "Not enough oil");
            oilBalances[_nftID] -= 15;
        }
        emit RaceStarted(player, _nftID);
    }

    function resetAllNftOwners() public onlyOwner {
        for (uint256 i = 0; i < maxId; i++) {
            delete nftOwner[i];
        }
    }

    function grantReward(address player, uint256 _nftID, uint8 _position) external onlyOwner {
        uint256 rewardAmount;

        if (_position == 1) {
            rewardAmount = 8 * 10 ** 18;
        } else if (_position == 2) {
            rewardAmount = 5 * 10 ** 18;
        } else if (_position == 3) {
            rewardAmount = 3 * 10 ** 18;
        } else {
            rewardAmount = 0;
        }

        require(rewardAmount > 0, "No reward for this position");
        require(ronKeToken.balanceOf(address(this)) >= rewardAmount, "Insufficient funds in contract");

        uint256 index = rewardCount[player];
        rewards[player][index] = Reward(rewardAmount, block.timestamp, false);
        rewardCount[player]++;

        nftRewards[_nftID].push(Reward(rewardAmount, block.timestamp, false));

        ronKeToken.transfer(player, rewardAmount);
        emit RewardGiven(player, rewardAmount);
    }

    function withdrawEarnings(uint256 _nftID) external {
        require(nftOwner[_nftID] == msg.sender, "You do not own this NFT");

        Reward[] storage nftRewardList = nftRewards[_nftID];
        uint256 totalAmount = 0;
        uint256 penalty = 0;
        uint256 currentTime = block.timestamp;

        for (uint256 i = 0; i < nftRewardList.length; i++) {
            if (nftRewardList[i].withdrawn) continue;

            uint256 timeElapsed = currentTime - nftRewardList[i].timestamp;
            uint256 amount = nftRewardList[i].amount;

            if (timeElapsed < 24 hours) penalty += (amount * 50) / 100;
            else if (timeElapsed < 48 hours) penalty += (amount * 30) / 100;
            else if (timeElapsed < 72 hours) penalty += (amount * 20) / 100;

            totalAmount += amount;
            nftRewardList[i].withdrawn = true;
        }

        require(totalAmount > 0, "No earnings available for withdrawal");
        uint256 finalAmount = totalAmount - penalty;

        ronKeToken.transfer(owner(), penalty);
        ronKeToken.transfer(msg.sender, finalAmount);

        emit Withdrawal(msg.sender, finalAmount, penalty);
    }
}
