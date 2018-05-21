pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMConstants} from "./EVMConstants.sol";
import {EVMAccounts} from "./EVMAccounts.slb";
import {EVMStorage} from "./EVMStorage.slb";
import {EVMMemory} from "./EVMMemory.slb";
import {EVMStack} from "./EVMStack.slb";

contract IEthereumRuntime is EVMConstants {

    address constant DEFAULT_CONTRACT_ADDRESS = 0x0101010101010101010101010101010101010101;
    address constant DEFAULT_CALLER = 0x1234567812345678123456781234567812345678;

    using EVMAccounts for EVMAccounts.Accounts;
    using EVMAccounts for EVMAccounts.Account;
    using EVMStorage for EVMStorage.Storage;
    using EVMMemory for EVMMemory.Memory;
    using EVMStack for EVMStack.Stack;

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

    struct State {
        EVMAccounts.Account caller;
        EVMAccounts.Account target;
        uint64 gasProvided;
        uint value;
        uint64 gas;
        bytes data;

        bytes lastRet;
        bytes returnData;

        EVMAccounts.Accounts accs;
        EVMMemory.Memory mem;
        EVMStack.Stack stack;
        Context context;

        // used by some handlers.
        uint n;
        uint pc;
    }

    struct Result {
        uint errno;
        uint errpc;
        bytes returnData;
        uint[] stack;
        bytes mem;
        uint[] accounts;
        bytes[] accountsCode;
    }

    struct Handlers {
        function(State memory) internal pure returns(uint)[256] f;
    }

    struct EVM {
        State state;
        Result result;
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

    function _newContext(address origin) internal pure returns (Context memory ctxt) {
        ctxt.origin = origin;
        return ctxt;
    }

    function _newState(TxInput memory input, Context memory ctxt) internal pure returns (State memory ste) {
        ste.gas = input.gas;
        ste.gasProvided = input.gas;
        ste.value = input.value;
        ste.stack = EVMStack.newStack();
        ste.mem = EVMMemory.newMemory();
        ste.data = input.data;
        ste.context = ctxt;

        ste.caller = ste.accs.get(input.caller);
        ste.caller.balance = input.callerBalance;
        ste.caller.nonce = input.callerNonce;

        ste.target = ste.accs.get(input.target);
        ste.target.balance = input.targetBalance;

        ste.target.nonce = input.targetNonce;
        ste.target.code = input.targetCode;
        return ste;
    }

    function _newEVM(State memory state, Handlers memory handlers) internal pure returns (EVM memory evm) {
        evm.state = state;
        evm.handlers = handlers;
    }

    function _toUint(bytes memory bts, uint addr, uint numBytes) internal pure returns (uint data) {
        assembly {
            data := mload(add(add(bts, 0x20), addr))
        }
        data = data >> 8*(32 - numBytes);
    }

    function _newContract() public pure returns (uint errno) {

    }

    function _newAddress(address addr, uint8 nonce) internal pure returns (address) {
        assert(nonce > 0);
        uint nonceM1 = nonce - 1;
        // TODO look into addresses with highest order bytes that are zero.
        if (nonceM1 < 0x80) {
            return address(keccak256(abi.encodePacked(
                uint8(0xd6),
                uint8(0x94),
                addr,
                uint8(nonceM1)
            )));
        } else {
            return address(keccak256(abi.encodePacked(
                uint8(0xd7),
                uint8(0x94),
                addr,
                uint8(0x81),
                uint8(nonceM1)
            )));
        }

    }

    function _call(EVM memory evm) internal pure {
        if(evm.state.value > 0) {
            if(evm.state.caller.balance < evm.state.value) {
                evm.result.errno = ERROR_INSUFFICIENT_FUNDS;
                return;
            }
            evm.state.caller.balance -= evm.state.value;
            evm.state.target.balance += evm.state.value;
        }

        if (evm.state.target.code.length == 0) {
            return;
        }
        _run(evm);
    }

    function _run(EVM memory evm) internal pure {

        uint pc = 0;
        uint errno = NO_ERROR;
        bytes memory code = evm.state.target.code;
        while (errno == NO_ERROR && pc < code.length) {
            uint opcode = uint(code[pc]);

            if (OP_PUSH1 <= opcode && opcode <= OP_PUSH32) {
                evm.state.pc = pc;
                uint n = opcode - OP_PUSH1 + 1;
                evm.state.n = n;
                errno = handlePUSH(evm.state);
                pc += n + 1;
                continue;
            } else if (OP_DUP1 <= opcode && opcode <= OP_DUP16) {
                evm.state.n = opcode - OP_DUP1 + 1;
                errno = handleDUP(evm.state);
            } else if (OP_SWAP1 <= opcode && opcode <= OP_SWAP16) {
                evm.state.n = opcode - OP_SWAP1 + 1;
                errno = handleSWAP(evm.state);
            } else if (opcode == OP_JUMP || opcode == OP_JUMPI) {
                evm.state.pc = pc;
                errno = evm.handlers.f[opcode](evm.state);
                pc = evm.state.pc;
                continue;
            } else if (opcode == OP_RETURN || opcode == OP_REVERT || opcode == OP_STOP || opcode == OP_SELFDESTRUCT) {
                errno = evm.handlers.f[opcode](evm.state);
                break;
            } else if (OP_LOG0 <= opcode && opcode <= OP_LOG4) {
                evm.state.n = opcode - OP_LOG0;
                errno = evm.handlers.f[opcode](evm.state);
            } else if (opcode == OP_PC) {
                errno = handlePC(evm.state);
            } else {
                errno = evm.handlers.f[opcode](evm.state);
            }
            // TODO better solution
            if (errno == NO_ERROR) {
                pc++;
            }
        }

        evm.result.stack = evm.state.stack.toArray();
        evm.result.mem = evm.state.mem.toArray();
        evm.result.returnData = evm.state.returnData;
        evm.result.errno = errno;
        evm.result.errpc = pc;
        (evm.result.accounts, evm.result.accountsCode) = evm.state.accs.toArray();
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
        State memory state = _newState(input, context);
        state.caller.nonce++;
        Handlers memory handlers = _newHandlers();
        EVM memory evm = _newEVM(state, handlers);
        _call(evm);
        return evm.result;
    }

    // ************************* Handlers ***************************

    // 0x0X

    function handleSTOP(State memory state) internal pure returns (uint errno) {
    }

    function handleADD(State memory state) internal pure returns (uint errno) {
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

    function handleMUL(State memory state) internal pure returns (uint errno) {
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

    function handleSUB(State memory state) internal pure returns (uint errno) {
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

    function handleDIV(State memory state) internal pure returns (uint errno) {
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

    function handleSDIV(State memory state) internal pure returns (uint errno) {
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

    function handleMOD(State memory state) internal pure returns (uint errno) {
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

    function handleSMOD(State memory state) internal pure returns (uint errno) {
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

    function handleADDMOD(State memory state) internal pure returns (uint errno) {
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

    function handleMULMOD(State memory state) internal pure returns (uint errno) {
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

    function handleEXP(State memory state) internal pure returns (uint errno) {
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

    function handleSIGNEXTEND(State memory state) internal pure returns (uint errno) {
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

    function handleSHL(State memory state) internal pure returns (uint errno) {
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

    function handleSHR(State memory state) internal pure returns (uint errno) {
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

    function handleSAR(State memory state) internal pure returns (uint errno) {
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

    function handleLT(State memory state) internal pure returns (uint errno) {
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

    function handleGT(State memory state) internal pure returns (uint errno) {
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

    function handleSLT(State memory state) internal pure returns (uint errno) {
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

    function handleSGT(State memory state) internal pure returns (uint errno) {
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

    function handleEQ(State memory state) internal pure returns (uint errno) {
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

    function handleISZERO(State memory state) internal pure returns (uint errno) {
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

    function handleAND(State memory state) internal pure returns (uint errno) {
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

    function handleOR(State memory state) internal pure returns (uint errno) {
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

    function handleXOR(State memory state) internal pure returns (uint errno) {
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

    function handleNOT(State memory state) internal pure returns (uint errno) {
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

    function handleBYTE(State memory state) internal pure returns (uint errno) {
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

    function handleSHA3(State memory state) internal pure returns (uint errno) {
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

    function handleADDRESS(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.target.addr));
    }

    function handleBALANCE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.accs.get(address(addr)).balance);
    }

    function handleORIGIN(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.context.origin));
    }

    function handleCALLER(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(uint(state.caller.addr));
    }

    function handleCALLVALUE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.value);
    }

    function handleCALLDATALOAD(State memory state) internal pure returns (uint errno) {
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

    function handleCALLDATASIZE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.data.length);
    }

    function handleCALLDATACOPY(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint dAddr = state.stack.pop();
        uint len = state.stack.pop();
        state.mem.storeBytesAndPadWithZeroes(state.data, dAddr, mAddr, len);
    }

    function handleCODESIZE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.target.code.length);
    }

    function handleCODECOPY(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint cAddr = state.stack.pop();
        uint len = state.stack.pop();
        if (cAddr + len < state.target.code.length) {
            return ERROR_INDEX_OOB;
        }
        state.mem.storeBytes(state.target.code, cAddr, mAddr, len);
    }

    function handleGASPRICE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.gasPrice);
    }

    function handleEXTCODESIZE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.accs.get(address(addr)).code.length);
    }

    function handleEXTCODECOPY(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 4) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint mAddr = state.stack.pop();
        uint dAddr = state.stack.pop();
        uint len = state.stack.pop();
        bytes memory code = state.accs.get(address(addr)).code;
        if (dAddr + len < code.length) {
            return ERROR_INDEX_OOB;
        }
        state.mem.storeBytes(code, dAddr, mAddr, len);
    }

    function handleRETURNDATASIZE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.lastRet.length);
    }

    function handleRETURNDATACOPY(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 3) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint mAddr = state.stack.pop();
        uint rAddr = state.stack.pop();
        uint len = state.stack.pop();
        state.mem.storeBytesAndPadWithZeroes(state.lastRet, rAddr, mAddr, len);
    }

    // 0x4X

    function handleBLOCKHASH(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint blockIndex = state.stack.pop();
        state.stack.push(0);
    }

    function handleCOINBASE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.coinBase);
    }

    function handleTIMESTAMP(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.time);
    }

    function handleNUMBER(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.blockNumber);
    }

    function handleDIFFICULTY(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.difficulty);
    }

    function handleGASLIMIT(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.context.gasLimit);
    }

    // 0x5X

    function handlePOP(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.pop();
    }

    function handleMLOAD(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        state.stack.push(state.mem.load(addr));
    }

    function handleMSTORE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.mem.store(addr, val);
    }

    function handleMSTORE8(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.mem.store8(addr, uint8(val));
    }

    function handleSLOAD(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.target.stge.load(addr);
        state.stack.push(val);
    }

    function handleSSTORE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint addr = state.stack.pop();
        uint val = state.stack.pop();
        state.target.stge.store(addr, val);
    }

    function handleJUMP(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 1) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint dest = state.stack.pop();
        if (dest >= state.target.code.length || uint(state.target.code[dest]) != OP_JUMPDEST) {
            return ERROR_INVALID_JUMP_DESTINATION;
        }
        state.pc = dest;
    }

    function handleJUMPI(State memory state) internal pure returns (uint errno) {
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

    function handlePC(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.pc);
    }

    function handleMSIZE(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.mem.size);
    }

    function handleGAS(State memory state) internal pure returns (uint errno) {
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        state.stack.push(state.gas);
    }

    function handleJUMPDEST(State memory state) internal pure returns (uint errno) {
    }

    // 0x6X, 0x7X


    function handlePUSH(State memory state) internal pure returns (uint errno) {
        assert(1 <= state.n && state.n <= 32);
        if (state.stack.size == MAX_STACK_SIZE) {
            return ERROR_STACK_OVERFLOW;
        }
        if (state.pc + state.n > state.target.code.length) {
            return ERROR_INDEX_OOB;
        }
        state.stack.push(_toUint(state.target.code, state.pc + 1, state.n));
    }

    // 0x8X

    function handleDUP(State memory state) internal pure returns (uint errno) {
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

    function handleSWAP(State memory state) internal pure returns (uint errno) {
        assert(1 <= state.n && state.n <= 16);
        if (state.stack.size <= state.n) {
            return ERROR_STACK_UNDERFLOW;
        }
        state.stack.swap(state.n);
    }

    // 0xaX
    function handleLOG(State memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    // 0xfX
    function handleCREATE(State memory state) internal pure returns (uint errno) {

        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleCALL(State memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleCALLCODE(State memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleRETURN(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint start = state.stack.pop();
        uint len = state.stack.pop();
        state.returnData = state.mem.toArray(start, len);
    }

    function handleDELEGATECALL(State memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleSTATICCALL(State memory state) internal pure returns (uint errno) {
        return ERROR_INSTRUCTION_NOT_SUPPORTED;
    }

    function handleREVERT(State memory state) internal pure returns (uint errno) {
        if (state.stack.size < 2) {
            return ERROR_STACK_UNDERFLOW;
        }
        uint start = state.stack.pop();
        uint len = state.stack.pop();
        state.returnData = state.mem.toArray(start, len);
        return ERROR_STATE_REVERTED;
    }

    function handleINVALID(State memory state) internal pure returns (uint errno) {
        return ERROR_INVALID_OPCODE;
    }

    function handleSELFDESTRUCT(State memory state) internal pure returns (uint errno) {
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