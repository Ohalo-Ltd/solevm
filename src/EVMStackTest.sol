pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMStack} from "./EVMStack.slb";
import {MemOps} from "./MemOps.slb";

contract EVMStackTest {
    using EVMStack for EVMStack.Stack;

    uint constant internal testVal1 = 55;
    uint constant internal testVal2 = 3246;
    uint constant internal testVal3 = 2;

    function testCreate() public payable returns (bool ret) {
        ret = true;
        uint fPtr = MemOps.freeMemPtr();
        EVMStack.Stack memory stack = EVMStack.newStack();
        assert(stack.dataPtr == fPtr + 0x60);
        assert(stack.size == 0);
        assert(stack.cap == 64);
    }

    function testPush() public payable returns (bool ret) {
        ret = true;
        uint DATA = 1234;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.push(DATA);
        uint val;
        uint pos = stack.dataPtr;
        assembly {
            val := mload(pos)
        }
        assert(val == DATA);
        assert(stack.size == 1);
        assert(stack.cap == 64);
    }

    function testPushThrowsOverflow() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.size = 1024;
        stack.push(1);
    }

    function testPop() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.push(1);
        uint data = stack.pop();
        assert(stack.size == 0);
        assert(data == 1);
        uint dataA;
        uint slot = stack.dataPtr;
        assembly {
            dataA := mload(slot)
        }
        assert(dataA == 0);
    }

    function testPopThrowsUnderflow() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.pop();
    }

    function testDup1() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.push(1);
        stack.dup(1);
        assert(stack.size == 2);
        assert(stack.pop() == 1);
        assert(stack.pop() == 1);
    }

    function testDup16() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        for (uint i = 0; i < 16; i++) {
            stack.push(i + 1);
        }
        stack.dup(16);
        assert(stack.size == 17);
        assert(stack.pop() == 1);
        for (uint i = 0; i < 16; i++) {
            assert(stack.pop() == 16 - i);
        }
    }

    function testDupThrowsNTooSmall() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.dup(0);
    }

    function testDupThrowsNTooLarge() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.dup(17);
    }

    function testDupThrowsUnderflow() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.dup(1);
    }

    function testDupThrowsOverflow() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.push(1);
        stack.size = 1024;
        stack.dup(1);
    }

    function testSwap1() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        for (uint i = 0; i < 17; i++) {
            stack.push(i + 1);
        }
        stack.swap(16);
        assert(stack.size == 17);
        assert(stack.pop() == 1);

        for (uint i = 0; i < 15; i++) {
            stack.pop();
        }
        assert(stack.pop() == 17);
    }

    function testSwap16() public payable returns (bool ret) {
        ret = true;
        EVMStack.Stack memory stack = EVMStack.newStack();
        stack.push(1);
        stack.push(2);
        stack.swap(1);
        assert(stack.size == 2);
        assert(stack.pop() == 1);
        assert(stack.pop() == 2);
    }
}
