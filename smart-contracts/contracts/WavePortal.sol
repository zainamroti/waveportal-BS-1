// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint) userWaveCount;
    address[] wavees;

    constructor() {
        console.log("Yo yo, I am a smart contract developer and I am smart ;)");
    }

    function wave() public {
        userWaveCount[msg.sender] = userWaveCount[msg.sender]++;
        console.log("%d totalWaves!", totalWaves);
        wavees.push(msg.sender);
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
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