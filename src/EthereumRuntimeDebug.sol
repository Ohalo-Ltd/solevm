pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {IEthereumRuntime, EthereumRuntime} from "./EthereumRuntime.sol";
import {EVMConstants} from "./EVMConstants.sol";
import {EVMAccounts} from "./EVMAccounts.slb";
import {EVMStorage} from "./EVMStorage.slb";
import {EVMMemory} from "./EVMMemory.slb";
import {EVMStack} from "./EVMStack.slb";
import {EVMLogs} from "./EVMLogs.slb";
import {EVMUtils} from "./EVMUtils.slb";

contract IEthereumRuntimeDebug is IEthereumRuntime {

    struct EVMPreImage {
        uint64 gas;
        uint value;
        bytes code;
        bytes data;
        address caller;
        address target;
        bool staticExec;

        uint[] stack;
        bytes mem;
        uint pc; // TODO Use smaller type?

        uint[] accounts;
        bytes accountsCode;
        uint[] logs;
        bytes logsData;
    }

    // Execute the EVM with the given pre-image.
    function execute(EVMPreImage memory preImage) public pure returns (Result memory result);

}

contract EthereumRuntimeDebug is EthereumRuntime, IEthereumRuntimeDebug {

    function execute(EVMPreImage memory preImage) public pure returns (Result memory result) {
        EVM memory evm;
        evm.gas = preImage.gas;
        evm.value = preImage.value;
        evm.code = preImage.code;
        evm.data = preImage.data;
        evm.accounts = _accsFromArray(preImage.accounts, preImage.accountsCode);
        evm.logs = _logsFromArray(preImage.logs, preImage.logsData);
        evm.stack = EVMStack.fromArray(preImage.stack);
        evm.mem = EVMMemory.fromArray(preImage.mem);
        evm.caller = evm.accounts.get(preImage.caller);
        evm.target = evm.accounts.get(preImage.target);
        Context memory ctxt;
        ctxt.origin = preImage.caller;
        evm.context = ctxt;
        evm.handlers = _newHandlers();
        evm.staticExec = preImage.staticExec;

        _run(evm, preImage.pc);

        result.stack = evm.stack.toArray();
        result.mem = evm.mem.toArray();
        result.returnData = evm.returnData;
        result.errno = evm.errno;
        result.errpc = evm.errpc;
        // TODO handle accounts that result from a failed transaction.
        (result.accounts, result.accountsCode) = evm.accounts.toArray();
        (result.logs, result.logsData) = evm.logs.toArray();
        return;
    }

    function _accsFromArray(uint[] accountsIn, bytes memory accountsCode) internal pure returns (EVMAccounts.Accounts memory accountsOut) {
        if (accountsIn.length == 0) {
            return;
        }
        uint offset = 0;
        while (offset < accountsIn.length) {
            address addr = address(accountsIn[offset]);
            EVMAccounts.Account memory acc = accountsOut.get(addr);
            acc.balance = accountsIn[offset + 1];
            acc.nonce = uint8(accountsIn[offset + 2]);
            acc.destroyed = accountsIn[offset + 3] == 1;
            uint codeOffset = accountsIn[offset + 4];
            uint codeSize = accountsIn[offset + 5];
            acc.code = new bytes(codeSize);
            EVMUtils.copy(accountsCode, acc.code, codeOffset, 0, codeSize);
            uint storageSize = accountsIn[offset + 6];
            for(uint i = 0; i < storageSize; i++) {
                acc.stge.store(accountsIn[offset + 7 + 2*i], accountsIn[offset + 8 + 2*i]);
            }
            offset += 7 + 2*storageSize;
        }
    }

    function _logsFromArray(uint[] logsIn, bytes memory logsData) internal pure returns (EVMLogs.Logs memory logsOut) {
        if (logsIn.length == 0) {
            return;
        }
        uint offset = 0;
        while (offset < logsIn.length) {
            EVMLogs.LogEntry memory logEntry;
            logEntry.account = address(logsIn[offset]);
            logEntry.topics[0] = logsIn[offset + 1];
            logEntry.topics[1] = logsIn[offset + 2];
            logEntry.topics[2] = logsIn[offset + 3];
            logEntry.topics[3] = logsIn[offset + 4];
            uint dataOffset = logsIn[offset + 5];
            uint dataSize = logsIn[offset + 6];
            logEntry.data = new bytes(dataSize);
            EVMUtils.copy(logsData, logEntry.data, dataOffset, 0, dataSize);
            logsOut.add(logEntry);
            offset += 7;
        }
    }

}