pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMStack} from "./EVMStack.slb";

contract TestContractEVMStack {

    using EVMStack for EVMStack.Stack;

    function test() public {
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
}