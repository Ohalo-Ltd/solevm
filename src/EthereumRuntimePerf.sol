pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMConstants} from "./EVMConstants.sol";
import {EVMAccounts} from "./EVMAccounts.slb";
import {EVMStorage} from "./EVMStorage.slb";
import {EVMMemory} from "./EVMMemory.slb";
import {EVMStack} from "./EVMStack.slb";
import {EVMLogs} from "./EVMLogs.slb";
import {EVMUtils} from "./EVMUtils.slb";

import {EthereumRuntime} from "./EthereumRuntime.sol";

contract EthereumRuntimePerf is EthereumRuntime {

    function _defaultTxInput(bytes memory code, bytes memory data) internal pure returns (TxInput memory input) {
        input.caller = DEFAULT_CALLER;
        input.target = DEFAULT_CONTRACT_ADDRESS;
        input.targetCode = code;
        input.data = data;
    }

    function _defaultContext(address origin) internal pure returns (Context memory context) {
        context.origin = origin;
    }

    function _defaultEVM() internal pure returns (EVM memory evm) {
        evm.stack = EVMStack.newStack();
        evm.mem = EVMMemory.newMemory();
    }

    function perfExecuteCodeDataEmpty() public payable returns (uint gas) {
        gas = gasleft();
        execute(new bytes(0), new bytes(0));
        gas -= gasleft();
    }

    function perfExecuteOnlyTxInfoEmpty() public payable returns (uint gas) {
        TxInput memory input = _defaultTxInput(new bytes(0), new bytes(0));
        gas = gasleft();
        execute(input);
        gas -= gasleft();
    }

    function perfExecuteEmpty() public payable returns (uint gas) {
        TxInput memory input = _defaultTxInput(new bytes(0), new bytes(0));
        Context memory context = _defaultContext(DEFAULT_CALLER);
        gas = gasleft();
        execute(input, context);
        gas -= gasleft();
    }

    function perfExecuteAdd() public payable returns (uint gas) {
        TxInput memory input = _defaultTxInput(hex"6001600101", new bytes(0));
        Context memory context = _defaultContext(DEFAULT_CALLER);
        gas = gasleft();
        execute(input, context);
        gas -= gasleft();
    }

    function perfAdd() public payable returns (uint gas) {
        EVM memory evm = _defaultEVM();
        evm.stack.push(1);
        evm.stack.push(1);
        gas = gasleft();
        handleADD(evm);
        gas -= gasleft();
    }
}
