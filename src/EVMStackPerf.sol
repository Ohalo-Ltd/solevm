pragma solidity ^0.5.0;

import {EVMStack} from "./EVMStack.slb";

contract EVMStackPerf {

    using EVMStack for EVMStack.Stack;

    function perfStackCreateNew() public payable returns (uint gas) {
        gas = gasleft();
        EVMStack.Stack memory stack = EVMStack.newStack();
        gas -= gasleft();
    }

    function perfStackPush() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        gas = gasleft();
        stack.push(1);
        gas -= gasleft();
    }

    function perfStackPop() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.push(1);
        gas = gasleft();
        stack.pop();
        gas -= gasleft();
    }

    function perfStackDup() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.push(1);
        gas = gasleft();
        stack.dup(1);
        gas -= gasleft();
    }

    function perfStackSwap() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.push(1);
        stack.push(1);
        gas = gasleft();
        stack.swap(1);
        gas -= gasleft();
    }

    function perfStackToArraySizeZero() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        gas = gasleft();
        stack.toArray();
        gas -= gasleft();
    }

    function perfStackToArraySizeOne() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.push(1);
        gas = gasleft();
        stack.toArray();
        gas -= gasleft();
    }

    function perfStackToArraySizeTen() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        for (uint i = 0; i < 10; i++) {
            stack.push(1);
        }
        gas = gasleft();
        stack.toArray();
        gas -= gasleft();
    }

    function perfStackExpandCapacityZeroTo64() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.size = 0;
        stack.cap = 0;
        gas = gasleft();
        stack.expandCapacity(64);
        gas -= gasleft();
    }

    function perfStackExpandCapacity64To128() public payable returns (uint gas) {
        EVMStack.Stack memory stack;
        stack.size = 64;
        stack.cap = 64;
        gas = gasleft();
        stack.expandCapacity(64);
        gas -= gasleft();
    }

}
