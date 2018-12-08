pragma solidity ^0.5.0;

import {EVMStack} from "./EVMStack.slb";


contract TestContractEVMStack {

    using EVMStack for EVMStack.Stack;

    uint public constant DATA = 1234;

    function test() public {
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