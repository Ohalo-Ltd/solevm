pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMUtils} from "./EVMUtils.slb";

contract EVMUtilsTest {

    function testToUintSuccess() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = new bytes(32);
        bts[31] = 5;
        uint x1 = EVMUtils.toUint(bts, 0, 32);
        assert(x1 == 5);
        uint x2 = EVMUtils.toUint(bts, 31, 1);
        assert(x2 == 5);
    }

    function testToUintThrowsIndexOOB() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = new bytes(32);
        uint x1 = EVMUtils.toUint(bts, 33, 0);
    }

    function testToUintThrowsNumBytesIsZero() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = new bytes(32);
        uint x1 = EVMUtils.toUint(bts, 1, 0);
    }

    function testToUintThrowsNumBytesExceeds32() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = new bytes(64);
        uint x1 = EVMUtils.toUint(bts, 1, 33);
    }

}
