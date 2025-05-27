// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Finance is Ownable, ReentrancyGuard {
    IERC20 public ronKeTokenContract;
    IERC721 public ronkenNftContract;

    address private walletReset = 0x9b229d8e80cAacD4C3E1AC4326963A8AB0712B0B;

    //structs
    struct Reward {
        uint256 amount;
        uint256 timestamp;
        bool withdrawn;
    }

    //contants
    bytes32 public constant COMMON = "COMMON";
    bytes32 public constant UNCOMMON = "UNCOMMON";
    bytes32 public constant RARE = "RARE";
    bytes32 public constant EPIC = "EPIC";

    //mappings
    mapping(uint256 => uint256) public oilBalances;
    mapping(uint256 => address) public nftOwner;
    mapping(address => uint256) public rewardCount;
    mapping(uint256 => Reward[]) public nftRewards;

    //states
    uint256 public maxId;
    uint256 public firstPlaceReward;
    uint256 public secondPlaceReward;
    uint256 public thirdPlaceReward;
    uint256 public minAmountRace;

    //events
    event RaceStarted(address indexed player, uint256 nftId);
    event RewardGiven(address indexed player, uint256 amount);
    event Withdrawal(address indexed player, uint256 amount, uint256 penalty);

    //cooldowns
    uint256 public lastResetTime;

    //constructor
    constructor(address owner, address _ronKeToken, address _ronkenNft) Ownable(owner) {
        ronKeTokenContract = IERC20(_ronKeToken);
        ronkenNftContract = IERC721(_ronkenNft);

        firstPlaceReward = 8 * 10 ** 18;
        secondPlaceReward = 5 * 10 ** 18;
        thirdPlaceReward = 3 * 10 ** 18;
        minAmountRace = 2 * 10 ** 18;
    }

    function setDefaultFuel(uint256 _nftID, bytes32 _rarity) private {
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

    function raceStart(uint256 _nftID, bytes32 _rarity) public payable {
        address player = msg.sender;
        require(ronkenNftContract.ownerOf(_nftID) == msg.sender, "You do not own this NFT");
        require(ronKeTokenContract.balanceOf(player) >= minAmountRace, "Insufficient funds");
        bool success = ronKeTokenContract.transferFrom(msg.sender, address(this), minAmountRace);
        require(success, "Token transfer failed");

        if (nftOwner[_nftID] == address(0)) {
            setDefaultFuel(_nftID, _rarity);
            nftOwner[_nftID] = player;
            oilBalances[_nftID] -= 15;
            maxId++;
        } else {
            nftOwner[_nftID] = player;
            uint256 currentOil = oilBalances[_nftID];
            require(currentOil > 0, "Not enough fuel");
            oilBalances[_nftID] -= 15;
        }
        emit RaceStarted(player, _nftID);
    }

    function resetAllNftOwners() public {
        uint256 currentBlock = block.timestamp;
        require(currentBlock > lastResetTime + 24 hours, "Reset is on cooldown");
        require(msg.sender == tx.origin, "No contracts allowed");
        require(msg.sender == walletReset, "Sender is not authorized to reset NFTs");

        lastResetTime = currentBlock;

        for (uint256 i = 0; i < maxId; i++) {
            delete nftOwner[i];
        }
    }

    function updateRewards(uint256 _first, uint256 _second, uint256 _third) public onlyOwner {
        firstPlaceReward = _first;
        secondPlaceReward = _second;
        thirdPlaceReward = _third;
    }

    function grantReward(address player, uint256 _nftID, uint8 _position) external onlyOwner {
        require(ronKeTokenContract.balanceOf(address(this)) > 0, "Insufficient funds in contract");

        uint256 rewardAmount;

        if (_position == 1) {
            rewardAmount = firstPlaceReward;
        } else if (_position == 2) {
            rewardAmount = secondPlaceReward;
        } else if (_position == 3) {
            rewardAmount = thirdPlaceReward;
        } else {
            rewardAmount = 0;
        }

        require(rewardAmount > 0, "No reward for this position");
        require(ronKeTokenContract.balanceOf(address(this)) >= rewardAmount, "Insufficient funds in contract");

        rewardCount[player]++;
        nftRewards[_nftID].push(Reward(rewardAmount, block.timestamp, false));

        ronKeTokenContract.transfer(player, rewardAmount);
        emit RewardGiven(player, rewardAmount);
    }

    function withdrawEarnings(uint256 _nftID) external nonReentrant {
        require(nftOwner[_nftID] == msg.sender, "You do not own this NFT");
        require(address(this).balance > 0, "Insufficient funds");

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

        ronKeTokenContract.transfer(owner(), penalty);
        ronKeTokenContract.transfer(msg.sender, finalAmount);

        emit Withdrawal(msg.sender, finalAmount, penalty);
    }
}
