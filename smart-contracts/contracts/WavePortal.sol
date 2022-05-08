// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint) userWaveCount;
    address[] wavees;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    /*
     * I declare a variable waves that lets me store an array of structs.
     * This is what lets me hold all the waves anyone ever sends to me!
     */
    Wave[] waves;

    constructor() payable {
        console.log("Yo yo, I am a smart contract developer and I am smart ;)");
    }

    function wave(string memory _message) public {
        userWaveCount[msg.sender] = userWaveCount[msg.sender]++;
        console.log("%d totalWaves!", totalWaves);
        wavees.push(msg.sender);
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        /*
         * This is where I actually store the wave data in the array.
         */
        waves.push(Wave(msg.sender, _message, block.timestamp));

        /*
         * I added some fanciness here, Google it and try to figure out what it is!
         * Let me know what you learn in #general-chill-chat
         */
        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getWavee(uint waveeId) public view returns (address) {
        console.log("Wavee of %d is %s", waveeId, wavees[waveeId]);
        return wavees[waveeId];
    }

    function getUserWaveCount(address user) public view returns (uint) {
        console.log("User %s Wave count %d", user, userWaveCount[user]);
        return userWaveCount[user];
    }



}