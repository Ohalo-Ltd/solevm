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

contract IEthereumRuntime is EVMConstants {

    address constant DEFAULT_CONTRACT_ADDRESS = 0x0101010101010101010101010101010101010101;
    address constant DEFAULT_CALLER = 0x1234567812345678123456781234567812345678;

    using EVMAccounts for EVMAccounts.Accounts;
    using EVMAccounts for EVMAccounts.Account;
    using EVMStorage for EVMStorage.Storage;
    using EVMMemory for EVMMemory.Memory;
    using EVMStack for EVMStack.Stack;
    using EVMLogs for EVMLogs.Logs;

    struct Context {
        address origin;
        uint gasPrice;
        uint gasLimit;
        uint coinBase;
        uint blockNumber;
        uint time;
        uint difficulty;
    }

    struct TxInput {
        uint64 gas;
        uint gasPrice;
        address caller;
        uint callerBalance;
        uint8 callerNonce;
        uint value;
        address target;
        uint targetBalance;
        uint8 targetNonce;
        bytes targetCode;
        bytes data;
    }

    struct EVMInput {
        uint64 gas;
        uint value;
        bytes data;
        address caller;
        address target;
        Context context;
        EVMAccounts.Accounts accounts;
        EVMLogs.Logs logs;
        Handlers handlers;
    }

    struct Result {
        uint errno;
        uint errpc;
        bytes returnData;
        uint[] stack;
        bytes mem;
        uint[] accounts;
        bytes accountsCode;
        uint[] logs;
        bytes logsData;
    }

    struct Handlers {
        function(EVM memory) internal pure returns(uint)[256] f;
    }

    struct EVM {
        uint64 gas;
        uint value;
        bytes data;
        bytes lastRet;
        bytes returnData;
        uint errno;
        uint errpc;

        EVMAccounts.Accounts accounts;
        EVMLogs.Logs logs;
        Context context;
        EVMMemory.Memory mem;
        EVMStack.Stack stack;

        uint depth;

        EVMAccounts.Account caller;
        EVMAccounts.Account target;
        uint n;
        uint pc;
        
        Handlers handlers;
    }

    // Execute the given code and call-data.
    function execute(bytes memory code, bytes memory data) public pure returns (Result memory state);

    // Execute the given transaction.
    function execute(TxInput memory input) public pure returns (Result memory result);

    // Execute the given transaction in the given context.
    function execute(TxInput memory input, Context memory context) public pure returns (Result memory result);

}

contract EthereumRuntime is IEthereumRuntime {

    constructor() public {}

    function _call(EVMInput memory evmInput) internal pure returns (EVM memory evm){
        evm.context = evmInput.context;
        evm.handlers = evmInput.handlers;
        evm.accounts = evmInput.accounts.copy();
        evm.logs = evmInput.logs.copy();
        evm.value = evmInput.value;
        evm.gas = evmInput.gas;
        evm.data = evmInput.data;
        evm.caller = evm.accounts.get(evmInput.caller);
        evm.target = evm.accounts.get(evmInput.target);

        // Increase the nonce. TODO
        evm.caller.nonce++;

        // Transfer value. TODO
        if(evm.value > 0) {
            if(evm.caller.balance < evm.value) {
                evm.errno = ERROR_INSUFFICIENT_FUNDS;
                return;
            }
            evm.caller.balance -= evm.value;
            evm.target.balance += evm.value;
        }

        // If there is no code to run, just continue. TODO
        if (evm.target.code.length == 0) {
            return;
        }
        _run(evm);
    }

    function _create(EVMInput memory evmInput) internal pure returns (EVM memory evm, address addr) {
        evm.context = evmInput.context;
        evm.handlers = evmInput.handlers;
        evm.accounts = evmInput.accounts.copy();
        evm.logs = evmInput.logs.copy();
        evm.value = evmInput.value;
        evm.gas = evmInput.gas;
        evm.caller = evm.accounts.get(evmInput.caller);

        // Increase the nonce. TODO
        evm.caller.nonce++;

        // Transfer value check. TODO
        if(evm.value > 0) {
            if(evm.caller.balance < evm.value) {
                evm.errno = ERROR_INSUFFICIENT_FUNDS;
                return;
            }
        }

        address newAddress = EVMUtils.newAddress(evm.caller.addr, evm.caller.nonce);

        // TODO
        if (evm.accounts.get(newAddress).nonce != 0) {
            evm.errno = ERROR_CONTRACT_CREATION_COLLISION;
            return;
        }

        EVMAccounts.Account memory newAcc = evm.accounts.get(newAddress);
        newAcc.nonce = 1;
        newAcc.code = evmInput.data;

        evm.caller.balance -= evm.value;
        newAcc.balance += evm.value;

        evm.target = newAcc;

        _run(evm);

        // TODO
        if (evm.errno != NO_ERROR) {
            return;
        }
        if (evm.returnData.length > MAX_CODE_SIZE) {
            evm.errno = ERROR_MAX_CODE_SIZE_EXCEEDED;
            return;
        }
        newAcc.code = evm.returnData;
        addr = newAddress;
    }

    function _run(EVM memory evm) internal pure {

        uint pc = 0;
        uint pcNext = 0;
        uint errno = NO_ERROR;
        bytes memory code = evm.target.code;

        evm.stack = EVMStack.newStack();
        evm.mem = EVMMemory.newMemory();

        while (errno == NO_ERROR && pc < code.length) {
            uint opcode = uint(code[pc]);

            if (OP_PUSH1 <= opcode && opcode <= OP_PUSH32) {
                evm.pc = pc;
                uint n = opcode - OP_PUSH1 + 1;
                evm.n = n;
                errno = handlePUSH(evm);
                pcNext = pc + n + 1;
            } else if (opcode == OP_JUMP || opcode == OP_JUMPI) {
                evm.pc = pc;
                errno = evm.handlers.f[opcode](evm);
                pcNext = evm.pc;
            } else if (opcode == OP_RETURN || opcode == OP_REVERT || opcode == OP_STOP || opcode == OP_SELFDESTRUCT) {
                errno = evm.handlers.f[opcode](evm);
                break;
            } else {
                if (OP_DUP1 <= opcode && opcode <= OP_DUP16) {
                    evm.n = opcode - OP_DUP1 + 1;
                    errno = handleDUP(evm);
                } else if (OP_SWAP1 <= opcode && opcode <= OP_SWAP16) {
                    evm.n = opcode - OP_SWAP1 + 1;
                    errno = handleSWAP(evm);
                } else if (OP_LOG0 <= opcode && opcode <= OP_LOG4) {
                    evm.n = opcode - OP_LOG0;
                    errno = handleLOG(evm);
                } else if (opcode == OP_PC) {
                    errno = handlePC(evm);
                } else {
                    errno = evm.handlers.f[opcode](evm);
                }
                pcNext = pc + 1;
            }
            if (errno == NO_ERROR) {
                pc = pcNext;
            }
        }
        evm.errno = errno;
        evm.errpc = pc;
    }

    function execute(bytes memory code, bytes memory data) public pure returns (Result memory result) {

        TxInput memory input = TxInput(
            0,
            0,
            DEFAULT_CALLER,
            0,
            0,
            0,
            DEFAULT_CONTRACT_ADDRESS,
            0,
            0,
            code,
            data
        );

        Context memory context = Context(
            DEFAULT_CALLER,
            0,
            0,
            0,
            0,
            0,
            0
        );
        return execute(input, context);
    }

    function execute(TxInput memory input) public pure returns (Result memory result) {
        Context memory context = Context(
            input.caller,
            0,
            0,
            0,
            0,
            0,
            0
        );
        return execute(input, context);
    }

    function execute(TxInput memory input, Context memory context) public pure returns (Result memory result) {
        EVMInput memory evmInput;
        evmInput.context = context;
        evmInput.handlers = _newHandlers();
        evmInput.data = input.data;

        EVMAccounts.Account memory caller = evmInput.accounts.get(input.caller);
        caller.balance = input.callerBalance;
        caller.nonce = input.callerNonce;
        evmInput.caller = input.caller;

        EVMAccounts.Account memory target = evmInput.accounts.get(input.target);
        target.balance = input.targetBalance;
        target.nonce = input.targetNonce;
        target.code = input.targetCode;
        evmInput.target = input.target;

        EVM memory evm = _call(evmInput);

        result.stack = evm.stack.toArray();
        result.mem = evm.mem.toArray();
        result.returnData = evm.returnData;
        result.errno = evm.errno;
        result.errpc = evm.errpc;
        (result.accounts, result.accountsCode) = evm.accounts.toArray();
        (result.logs, result.logsData) = evm.logs.toArray();
        return;
    }

    // ************************* Handlers ***************************

    // 0x0X

    function handleSTOP(EVM memory state) internal pure returns (uint errno) {
    }

    function handleADD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := add(a, b)
        }
        state.stack.push(c);
    }

    function handleMUL(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := mul(a, b)
        }
        state.stack.push(c);
    }

    function handleSUB(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := sub(a, b)
        }
        state.stack.push(c);
    }

    function handleDIV(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := div(a, b)
        }
        state.stack.push(c);
    }

    function handleSDIV(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := sdiv(a, b)
        }
        state.stack.push(c);
    }

    function handleMOD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := mod(a, b)
        }
        state.stack.push(c);
    }

    function handleSMOD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := smod(a, b)
        }
        state.stack.push(c);
    }

    function handleADDMOD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint m = state.stack.pop();
        uint c;
        assembly {
            c := addmod(a, b, m)
        }
        state.stack.push(c);
    }

    function handleMULMOD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint m = state.stack.pop();
        uint c;
        assembly {
            c := mulmod(a, b, m)
        }
        state.stack.push(c);
    }

    function handleEXP(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := exp(a, b)
        }
        state.stack.push(c);
    }

    function handleSIGNEXTEND(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := signextend(a, b)
        }
        state.stack.push(c);
    }

    function handleSHL(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := shl(a, b)
        }
        state.stack.push(c);
    }

    function handleSHR(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := shr(a, b)
        }
        state.stack.push(c);
    }

    function handleSAR(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := sar(a, b)
        }
        state.stack.push(c);
    }

    // 0x1X

    function handleLT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := lt(a, b)
        }
        state.stack.push(c);
    }

    function handleGT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := gt(a, b)
        }
        state.stack.push(c);
    }

    function handleSLT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := slt(a, b)
        }
        state.stack.push(c);
    }

    function handleSGT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := sgt(a, b)
        }
        state.stack.push(c);
    }

    function handleEQ(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := eq(a, b)
        }
        state.stack.push(c);
    }

    function handleISZERO(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint data = state.stack.pop();
        uint res;
        assembly {
            res := iszero(data)
        }
        state.stack.push(res);
    }

    function handleAND(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := and(a, b)
        }
        state.stack.push(c);
    }

    function handleOR(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := or(a, b)
        }
        state.stack.push(c);
    }

    function handleXOR(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint a = state.stack.pop();
        uint b = state.stack.pop();
        uint c;
        assembly {
            c := xor(a, b)
        }
        state.stack.push(c);
    }

    function handleNOT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint data = state.stack.pop();
        uint res;
        assembly {
            res := not(data)
        }
        state.stack.push(res);
    }

    function handleBYTE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint n = state.stack.pop();
        uint x = state.stack.pop();
        uint b;
        assembly {
            b := byte(n, x)
        }
        state.stack.push(b);
    }

    // 0x2X

    function handleSHA3(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint p = state.stack.pop();
        uint n = state.stack.pop();
        uint mp = state.mem.memUPtr(p);
        uint res;
        assembly {
            res := sha3(mp, n)
        }
        state.stack.push(res);
    }

    // 0x3X

    function handleADDRESS(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.target.addr));
    }

    function handleBALANCE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.accounts.get(address(addr)).balance);
    }

    function handleORIGIN(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.context.origin));
    }

    function handleCALLER(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.caller.addr));
    }

    function handleCALLVALUE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.value);
    }

    function handleCALLDATALOAD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        bytes memory data = state.data;
        uint val;
        // When some or all of the 32 bytes fall outside of the calldata array,
        // we have to replace those bytes with zeroes.
        if (addr >= data.length) {
            val = 0;
        } else {
            assembly {
                val := mload(add(data, add(0x20, addr)))
            }
            if (addr + WORD_SIZE > data.length) {
                val &= ~uint(0) << 8*(32 - data.length + addr);
            }
        }
        state.stack.push(val);
    }

    function handleCALLDATASIZE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.data.length);
    }

    function handleCALLDATACOPY(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint dAddr = state.stack.pop();
        uint len = state.stack.pop();
        state.mem.storeBytesAndPadWithZeroes(state.data, dAddr, mAddr, len);
    }

    function handleCODESIZE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.target.code.length);
    }

    function handleCODECOPY(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint cAddr = state.stack.pop();
        uint len = state.stack.pop();
        if (cAddr + len > state.target.code.length) {
            return ERROR_INDEX_OOB;
        }
        state.mem.storeBytes(state.target.code, cAddr, mAddr, len);
    }

    function handleGASPRICE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.gasPrice);
    }

    function handleEXTCODESIZE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.accounts.get(address(addr)).code.length);
    }

    function handleEXTCODECOPY(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 4) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint mAddr = state.stack.pop();
        uint dAddr = state.stack.pop();
        uint len = state.stack.pop();
        bytes memory code = state.accounts.get(address(addr)).code;
        if (dAddr + len > code.length) {
            return ERROR_INDEX_OOB;
        }
        state.mem.storeBytes(code, dAddr, mAddr, len);
    }

    function handleRETURNDATASIZE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.lastRet.length);
    }

    function handleRETURNDATACOPY(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint rAddr = state.stack.pop();
        uint len = state.stack.pop();
        state.mem.storeBytesAndPadWithZeroes(state.lastRet, rAddr, mAddr, len);
    }

    // 0x4X

    function handleBLOCKHASH(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint blockIndex = state.stack.pop();
        state.stack.push(0);
    }

    function handleCOINBASE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.coinBase);
    }

    function handleTIMESTAMP(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.time);
    }

    function handleNUMBER(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.blockNumber);
    }

    function handleDIFFICULTY(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.difficulty);
    }

    function handleGASLIMIT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.gasLimit);
    }

    // 0x5X

    function handlePOP(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.pop();
    }

    function handleMLOAD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.mem.load(addr));
    }

    function handleMSTORE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.mem.store(addr, val);
    }

    function handleMSTORE8(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.mem.store8(addr, uint8(val));
    }

    function handleSLOAD(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.target.stge.load(addr);
        state.stack.push(val);
    }

    function handleSSTORE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.target.stge.store(addr, val);
    }

    function handleJUMP(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint dest = state.stack.pop();
        if (dest >= state.target.code.length || uint(state.target.code[dest]) != OP_JUMPDEST) {
            return ERROR_INVALID_JUMP_DESTINATION;
        }
        state.pc = dest;
    }

    function handleJUMPI(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint dest = state.stack.pop();
        uint cnd = state.stack.pop();
        if (cnd == 0) {
            state.pc = state.pc + 1;
            return;
        }
        if (dest >= state.target.code.length || uint(state.target.code[dest]) != OP_JUMPDEST) {
            return ERROR_INVALID_JUMP_DESTINATION;
        }
        state.pc = dest;
    }

    function handlePC(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.pc);
    }

    function handleMSIZE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.mem.size);
    }

    function handleGAS(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.gas);
    }

    function handleJUMPDEST(EVM memory state) internal pure returns (uint errno) {
    }

    // 0x6X, 0x7X


    function handlePUSH(EVM memory state) internal pure returns (uint errno) {
        assert(1 <= state.n && state.n <= 32);
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        if (state.pc + state.n > state.target.code.length) {
            return ERROR_INDEX_OOB;
        }
        state.stack.push(EVMUtils.toUint(state.target.code, state.pc + 1, state.n));
    }

    // 0x8X

    function handleDUP(EVM memory state) internal pure returns (uint errno) {
        assert(1 <= state.n && state.n <= 16);
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        if (state.stack.size < state.n) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.dup(state.n);
    }

    // 0x9X

    function handleSWAP(EVM memory state) internal pure returns (uint errno) {
        assert(1 <= state.n && state.n <= 16);
        if (state.stack.size <= state.n) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.swap(state.n);
    }

    // 0xaX
    function handleLOG(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2 + state.n) {
            return ERROR_STACK_UNDERFLOW;
        }
        EVMLogs.LogEntry memory log;
        log.account = state.target.addr;
        uint mAddr = state.stack.pop();
        uint mSize = state.stack.pop();
        for (uint i = 0; i < state.n; i++) {
            log.topics[i] = state.stack.pop();
        }
        log.data = state.mem.toArray(mAddr, mSize);
        state.logs.add(log);
    }

    // 0xfX
    function handleCREATE(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint value = state.stack.pop();
        uint memPos = state.stack.pop();
        uint size = state.stack.pop();
        EVMInput memory input;
        // input.gas = gas; TODO
        input.value = value;
        input.data = state.mem.toArray(memPos, size);
        input.caller = state.target.addr;
        input.context = state.context;
        input.accounts = state.accounts;
        input.logs = state.logs;
        input.handlers = state.handlers;
        EVM memory retEvm;
        address newAddress;
        (retEvm, newAddress) = _create(input);
        if (retEvm.errno != NO_ERROR) {
            state.stack.push(0);
        } else {
            state.stack.push(uint(newAddress));
            state.accounts = retEvm.accounts;
        }

    }

    function handleCALL(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 7) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.pop(); // gas
        uint targetAddr = state.stack.pop();
        uint value = state.stack.pop();
        uint inOffset = state.stack.pop();
        uint inSize = state.stack.pop();

        uint retOffset = state.stack.pop(); // return offset
        uint retSize = state.stack.pop(); // return size
        EVMInput memory input;
        // TODO gas
        input.value = value;
        input.data = state.mem.toArray(inOffset, inSize);
        input.caller = state.target.addr;
        input.target = address(targetAddr);
        input.context = state.context;
        input.accounts = state.accounts;
        input.logs = state.logs;
        input.handlers = state.handlers;
        EVM memory retEvm = _call(input);
        if (retEvm.errno != NO_ERROR) {
            state.stack.push(0);
            state.lastRet = new bytes(0);
        } else {
            state.stack.push(1);
            state.mem.storeBytes(retEvm.returnData, 0, retOffset, retSize);
            state.lastRet = retEvm.returnData;
            // Update to the new state.
            state.accounts = retEvm.accounts;
            state.logs = retEvm.logs;
        }
    }

    function handleCALLCODE(EVM memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleRETURN(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint start = state.stack.pop();
        uint len = state.stack.pop();
        state.returnData = state.mem.toArray(start, len);
    }

    function handleDELEGATECALL(EVM memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleSTATICCALL(EVM memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleREVERT(EVM memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint start = state.stack.pop();
        uint len = state.stack.pop();
        state.returnData = state.mem.toArray(start, len);
        return ERROR_STATE_REVERTED;
    }

    function handleINVALID(EVM memory state) internal pure returns (uint errno) {
        return ERROR_INVALID_OPCODE;
    }

    function handleSELFDESTRUCT(EVM memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function _newHandlers() internal pure returns (Handlers memory handlers) {
        handlers.f[OP_STOP] = handleSTOP; // 0x0X
        handlers.f[OP_ADD] = handleADD;
        handlers.f[OP_MUL] = handleMUL;
        handlers.f[OP_SUB] = handleSUB;
        handlers.f[OP_DIV] = handleDIV;
        handlers.f[OP_SDIV] = handleSDIV;
        handlers.f[OP_MOD] = handleMOD;
        handlers.f[OP_SMOD] = handleSMOD;
        handlers.f[OP_ADDMOD] = handleADDMOD;
        handlers.f[OP_MULMOD] = handleMULMOD;
        handlers.f[OP_EXP] = handleEXP;
        handlers.f[OP_SIGNEXTEND] = handleSIGNEXTEND;
        handlers.f[0x0c] = handleINVALID;
        handlers.f[0x0d] = handleINVALID;
        handlers.f[0x0e] = handleINVALID;
        handlers.f[0x0f] = handleINVALID;
        handlers.f[OP_LT] = handleLT; // 0x1X
        handlers.f[OP_GT] = handleGT;
        handlers.f[OP_SLT] = handleSLT;
        handlers.f[OP_SGT] = handleSGT;
        handlers.f[OP_EQ] = handleEQ;
        handlers.f[OP_ISZERO] = handleISZERO;
        handlers.f[OP_AND] = handleAND;
        handlers.f[OP_OR] = handleOR;
        handlers.f[OP_XOR] = handleXOR;
        handlers.f[OP_NOT] = handleNOT;
        handlers.f[OP_BYTE] = handleBYTE;
        handlers.f[OP_SHL] = handleSHL;
        handlers.f[OP_SHR] = handleSHR;
        handlers.f[OP_SAR] = handleSAR;
        handlers.f[0x1e] = handleINVALID;
        handlers.f[0x1f] = handleINVALID;
        handlers.f[OP_SHA3] = handleSHA3; // 0x2X
        handlers.f[0x21] = handleINVALID;
        handlers.f[0x22] = handleINVALID;
        handlers.f[0x23] = handleINVALID;
        handlers.f[0x24] = handleINVALID;
        handlers.f[0x25] = handleINVALID;
        handlers.f[0x26] = handleINVALID;
        handlers.f[0x27] = handleINVALID;
        handlers.f[0x28] = handleINVALID;
        handlers.f[0x29] = handleINVALID;
        handlers.f[0x2a] = handleINVALID;
        handlers.f[0x2b] = handleINVALID;
        handlers.f[0x2c] = handleINVALID;
        handlers.f[0x2d] = handleINVALID;
        handlers.f[0x2e] = handleINVALID;
        handlers.f[0x2f] = handleINVALID;
        handlers.f[OP_ADDRESS] = handleADDRESS; // 0x3X
        handlers.f[OP_BALANCE] = handleBALANCE;
        handlers.f[OP_ORIGIN] = handleORIGIN;
        handlers.f[OP_CALLER] = handleCALLER;
        handlers.f[OP_CALLVALUE] = handleCALLVALUE;
        handlers.f[OP_CALLDATALOAD] = handleCALLDATALOAD;
        handlers.f[OP_CALLDATASIZE] = handleCALLDATASIZE;
        handlers.f[OP_CALLDATACOPY] = handleCALLDATACOPY;
        handlers.f[OP_CODESIZE] = handleCODESIZE;
        handlers.f[OP_CODECOPY] = handleCODECOPY;
        handlers.f[OP_GASPRICE] = handleGASPRICE;
        handlers.f[OP_EXTCODESIZE] = handleEXTCODESIZE;
        handlers.f[OP_EXTCODECOPY] = handleEXTCODECOPY;
        handlers.f[OP_RETURNDATASIZE] = handleRETURNDATASIZE;
        handlers.f[OP_RETURNDATACOPY] = handleRETURNDATACOPY;
        handlers.f[0x3f] = handleINVALID;
        handlers.f[OP_BLOCKHASH] = handleBLOCKHASH; // 0x4X
        handlers.f[OP_COINBASE] = handleCOINBASE;
        handlers.f[OP_TIMESTAMP] = handleTIMESTAMP;
        handlers.f[OP_NUMBER] = handleNUMBER;
        handlers.f[OP_DIFFICULTY] = handleDIFFICULTY;
        handlers.f[OP_GASLIMIT] = handleGASLIMIT;
        handlers.f[0x46] = handleINVALID;
        handlers.f[0x47] = handleINVALID;
        handlers.f[0x48] = handleINVALID;
        handlers.f[0x49] = handleINVALID;
        handlers.f[0x4a] = handleINVALID;
        handlers.f[0x4b] = handleINVALID;
        handlers.f[0x4c] = handleINVALID;
        handlers.f[0x4d] = handleINVALID;
        handlers.f[0x4e] = handleINVALID;
        handlers.f[0x4f] = handleINVALID; // 0x5X
        handlers.f[OP_POP] = handlePOP;
        handlers.f[OP_MLOAD] = handleMLOAD;
        handlers.f[OP_MSTORE] = handleMSTORE;
        handlers.f[OP_MSTORE8] = handleMSTORE8;
        handlers.f[OP_SLOAD] = handleSLOAD;
        handlers.f[OP_SSTORE] = handleSSTORE;
        handlers.f[OP_JUMP] = handleJUMP;
        handlers.f[OP_JUMPI] = handleJUMPI;
        handlers.f[OP_PC] = handlePC;
        handlers.f[OP_MSIZE] = handleMSIZE;
        handlers.f[OP_GAS] = handleGAS;
        handlers.f[OP_JUMPDEST] = handleJUMPDEST;
        handlers.f[0x5c] = handleINVALID;
        handlers.f[0x5d] = handleINVALID;
        handlers.f[0x5e] = handleINVALID;
        handlers.f[0x5f] = handleINVALID;
        handlers.f[OP_PUSH1] = handlePUSH; // 0x6X, 0x7X
        handlers.f[OP_PUSH2] = handlePUSH;
        handlers.f[OP_PUSH3] = handlePUSH;
        handlers.f[OP_PUSH4] = handlePUSH;
        handlers.f[OP_PUSH5] = handlePUSH;
        handlers.f[OP_PUSH6] = handlePUSH;
        handlers.f[OP_PUSH7] = handlePUSH;
        handlers.f[OP_PUSH8] = handlePUSH;
        handlers.f[OP_PUSH9] = handlePUSH;
        handlers.f[OP_PUSH10] = handlePUSH;
        handlers.f[OP_PUSH11] = handlePUSH;
        handlers.f[OP_PUSH12] = handlePUSH;
        handlers.f[OP_PUSH13] = handlePUSH;
        handlers.f[OP_PUSH14] = handlePUSH;
        handlers.f[OP_PUSH15] = handlePUSH;
        handlers.f[OP_PUSH16] = handlePUSH;
        handlers.f[OP_PUSH17] = handlePUSH;
        handlers.f[OP_PUSH18] = handlePUSH;
        handlers.f[OP_PUSH19] = handlePUSH;
        handlers.f[OP_PUSH20] = handlePUSH;
        handlers.f[OP_PUSH21] = handlePUSH;
        handlers.f[OP_PUSH22] = handlePUSH;
        handlers.f[OP_PUSH23] = handlePUSH;
        handlers.f[OP_PUSH24] = handlePUSH;
        handlers.f[OP_PUSH25] = handlePUSH;
        handlers.f[OP_PUSH26] = handlePUSH;
        handlers.f[OP_PUSH27] = handlePUSH;
        handlers.f[OP_PUSH28] = handlePUSH;
        handlers.f[OP_PUSH29] = handlePUSH;
        handlers.f[OP_PUSH30] = handlePUSH;
        handlers.f[OP_PUSH31] = handlePUSH;
        handlers.f[OP_PUSH32] = handlePUSH;
        handlers.f[OP_DUP1] = handleDUP; // 0x8X
        handlers.f[OP_DUP2] = handleDUP;
        handlers.f[OP_DUP3] = handleDUP;
        handlers.f[OP_DUP4] = handleDUP;
        handlers.f[OP_DUP5] = handleDUP;
        handlers.f[OP_DUP6] = handleDUP;
        handlers.f[OP_DUP7] = handleDUP;
        handlers.f[OP_DUP8] = handleDUP;
        handlers.f[OP_DUP9] = handleDUP;
        handlers.f[OP_DUP10] = handleDUP;
        handlers.f[OP_DUP11] = handleDUP;
        handlers.f[OP_DUP12] = handleDUP;
        handlers.f[OP_DUP13] = handleDUP;
        handlers.f[OP_DUP14] = handleDUP;
        handlers.f[OP_DUP15] = handleDUP;
        handlers.f[OP_DUP16] = handleDUP;
        handlers.f[OP_SWAP1] = handleSWAP; // 0x9X
        handlers.f[OP_SWAP2] = handleSWAP;
        handlers.f[OP_SWAP3] = handleSWAP;
        handlers.f[OP_SWAP4] = handleSWAP;
        handlers.f[OP_SWAP5] = handleSWAP;
        handlers.f[OP_SWAP6] = handleSWAP;
        handlers.f[OP_SWAP7] = handleSWAP;
        handlers.f[OP_SWAP8] = handleSWAP;
        handlers.f[OP_SWAP9] = handleSWAP;
        handlers.f[OP_SWAP10] = handleSWAP;
        handlers.f[OP_SWAP11] = handleSWAP;
        handlers.f[OP_SWAP12] = handleSWAP;
        handlers.f[OP_SWAP13] = handleSWAP;
        handlers.f[OP_SWAP14] = handleSWAP;
        handlers.f[OP_SWAP15] = handleSWAP;
        handlers.f[OP_SWAP16] = handleSWAP;
        handlers.f[OP_LOG0] = handleLOG; // 0xaX
        handlers.f[OP_LOG1] = handleLOG;
        handlers.f[OP_LOG2] = handleLOG;
        handlers.f[OP_LOG3] = handleLOG;
        handlers.f[OP_LOG4] = handleLOG;
        handlers.f[0xa5] = handleINVALID;
        handlers.f[0xa6] = handleINVALID;
        handlers.f[0xa7] = handleINVALID;
        handlers.f[0xa8] = handleINVALID;
        handlers.f[0xa9] = handleINVALID;
        handlers.f[0xaa] = handleINVALID;
        handlers.f[0xab] = handleINVALID;
        handlers.f[0xac] = handleINVALID;
        handlers.f[0xad] = handleINVALID;
        handlers.f[0xae] = handleINVALID;
        handlers.f[0xaf] = handleINVALID;
        handlers.f[0xb0] = handleINVALID; // 0xbX
        handlers.f[0xb1] = handleINVALID;
        handlers.f[0xb2] = handleINVALID;
        handlers.f[0xb3] = handleINVALID;
        handlers.f[0xb4] = handleINVALID;
        handlers.f[0xb5] = handleINVALID;
        handlers.f[0xb6] = handleINVALID;
        handlers.f[0xb7] = handleINVALID;
        handlers.f[0xb8] = handleINVALID;
        handlers.f[0xb9] = handleINVALID;
        handlers.f[0xba] = handleINVALID;
        handlers.f[0xbb] = handleINVALID;
        handlers.f[0xbc] = handleINVALID;
        handlers.f[0xbd] = handleINVALID;
        handlers.f[0xbe] = handleINVALID;
        handlers.f[0xbf] = handleINVALID;
        handlers.f[0xc0] = handleINVALID; // 0xcX
        handlers.f[0xc1] = handleINVALID;
        handlers.f[0xc2] = handleINVALID;
        handlers.f[0xc3] = handleINVALID;
        handlers.f[0xc4] = handleINVALID;
        handlers.f[0xc5] = handleINVALID;
        handlers.f[0xc6] = handleINVALID;
        handlers.f[0xc7] = handleINVALID;
        handlers.f[0xc8] = handleINVALID;
        handlers.f[0xc9] = handleINVALID;
        handlers.f[0xca] = handleINVALID;
        handlers.f[0xcb] = handleINVALID;
        handlers.f[0xcc] = handleINVALID;
        handlers.f[0xcd] = handleINVALID;
        handlers.f[0xce] = handleINVALID;
        handlers.f[0xcf] = handleINVALID;
        handlers.f[0xd0] = handleINVALID; // 0xdX
        handlers.f[0xd1] = handleINVALID;
        handlers.f[0xd2] = handleINVALID;
        handlers.f[0xd3] = handleINVALID;
        handlers.f[0xd4] = handleINVALID;
        handlers.f[0xd5] = handleINVALID;
        handlers.f[0xd6] = handleINVALID;
        handlers.f[0xd7] = handleINVALID;
        handlers.f[0xd8] = handleINVALID;
        handlers.f[0xd9] = handleINVALID;
        handlers.f[0xda] = handleINVALID;
        handlers.f[0xdb] = handleINVALID;
        handlers.f[0xdc] = handleINVALID;
        handlers.f[0xdd] = handleINVALID;
        handlers.f[0xde] = handleINVALID;
        handlers.f[0xdf] = handleINVALID;
        handlers.f[0xe0] = handleINVALID; // 0xeX
        handlers.f[0xe1] = handleINVALID;
        handlers.f[0xe2] = handleINVALID;
        handlers.f[0xe3] = handleINVALID;
        handlers.f[0xe4] = handleINVALID;
        handlers.f[0xe5] = handleINVALID;
        handlers.f[0xe6] = handleINVALID;
        handlers.f[0xe7] = handleINVALID;
        handlers.f[0xe8] = handleINVALID;
        handlers.f[0xe9] = handleINVALID;
        handlers.f[0xea] = handleINVALID;
        handlers.f[0xeb] = handleINVALID;
        handlers.f[0xec] = handleINVALID;
        handlers.f[0xed] = handleINVALID;
        handlers.f[0xee] = handleINVALID;
        handlers.f[0xef] = handleINVALID;
        handlers.f[OP_CREATE] = handleCREATE; // 0xfX
        handlers.f[OP_CALL] = handleCALL;
        handlers.f[OP_CALLCODE] = handleCALLCODE;
        handlers.f[OP_RETURN] = handleRETURN;
        handlers.f[OP_DELEGATECALL] = handleDELEGATECALL;
        handlers.f[0xf5] = handleINVALID;
        handlers.f[0xf6] = handleINVALID;
        handlers.f[0xf7] = handleINVALID;
        handlers.f[0xf8] = handleINVALID;
        handlers.f[0xf9] = handleINVALID;
        handlers.f[OP_STATICCALL] = handleSTATICCALL;
        handlers.f[0xfb] = handleINVALID;
        handlers.f[0xfc] = handleINVALID;
        handlers.f[OP_REVERT] = handleREVERT;
        handlers.f[OP_INVALID] = handleINVALID;
        handlers.f[OP_SELFDESTRUCT] = handleSELFDESTRUCT;
    }

}