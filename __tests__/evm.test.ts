import {
    createTxInput,
    execute,
    executeWithTxInput
} from "../script/adapter";
import {BigNumber} from "bignumber.js";
import {
    ADD,
    ADDMOD, ADDRESS,
    AND, BALANCE,
    BIN_OUTPUT_PATH, BLOCKHASH, BYTE, CALLDATACOPY,
    CALLDATALOAD,
    CALLDATASIZE, CALLER, CALLVALUE, CODECOPY, CODESIZE, COINBASE,
    CONTRACT_TEST_SIG, CREATE, DEFAULT_CALLER, DEFAULT_CONTRACT_ADDRESS, DIFFICULTY,
    DIV,
    DUP1,
    DUP16, DUP3,
    EQ, ERROR_INVALID_JUMP_DESTINATION, ERROR_INVALID_OPCODE, ERROR_STACK_UNDERFLOW,
    ERROR_STATE_REVERTED,
    EVM_EXECUTE_SIG,
    EXP, GAS, GASLIMIT, GASPRICE, GT, ISZERO,
    JUMP,
    JUMPDEST,
    JUMPI,
    LT, MLOAD,
    MOD, MSIZE,
    MSTORE, MSTORE8,
    MUL, MULMOD,
    NO_ERROR, NOT, NUMBER, OR,
    PC,
    POP,
    PUSH1, PUSH2, PUSH20,
    PUSH29,
    PUSH32,
    PUSH4, PUSH5,
    RETURN,
    REVERT,
    ROOT_PATH,
    SDIV, SGT, SHA3, SLOAD, SLT,
    SMOD, SOL_ETH_SRC,
    SRC_PATH, SSTORE, STATICCALL, STOP,
    SUB,
    SWAP1,
    SWAP10,
    SWAP11,
    SWAP12,
    SWAP13,
    SWAP14,
    SWAP15,
    SWAP16,
    SWAP2,
    SWAP3,
    SWAP4,
    SWAP5,
    SWAP6,
    SWAP7,
    SWAP8,
    SWAP9, TIMESTAMP, XOR
} from "../script/constants";
import {compile} from "../script/solc";
import path = require("path");
import {readText} from "../script/io";

beforeAll(async () => {
    console.log("Compiling contracts.");
    await compile(SOL_ETH_SRC, BIN_OUTPUT_PATH, true);
    await compile(path.join(SRC_PATH, 'testcontracts.sol'), BIN_OUTPUT_PATH, true);
    await compile(path.join(SRC_PATH, 'testcontracts_advanced.sol'), BIN_OUTPUT_PATH, true);
    console.log("Compiling done.");
}, 100000);

const runTest = async (code, data, resExpected) => {
    const result = await execute(code, data);
    expect(result.errno).toEqual(resExpected.errno);
    expect(result.errpc).toEqual(resExpected.errpc);
    expect(result.returnData).toEqual(resExpected.returnData);
    expect(result.mem.length).toEqual(resExpected.mem.length);
    expect(result.mem).toEqual(resExpected.mem);
    expect(result.stack.length).toEqual(resExpected.stack.length);
    for (let i = 0; i < result.stack.length; i++) {
        expect(result.stack[i].eq(resExpected.stack[i])).toBeTruthy();
    }
    return result;
};

const runTestWithInput = async (input, resExpected) => {
    const result = await executeWithTxInput(input);
    expect(result.errno).toEqual(resExpected.errno);
    expect(result.errpc).toEqual(resExpected.errpc);
    expect(result.returnData).toEqual(resExpected.returnData);
    expect(result.mem.length).toEqual(resExpected.mem.length);
    expect(result.mem).toEqual(resExpected.mem);
    expect(result.stack.length).toEqual(resExpected.stack.length);
    for (let i = 0; i < result.stack.length; i++) {
        expect(result.stack[i].eq(resExpected.stack[i])).toBeTruthy();
    }
    return result;
};

describe('single instructions', async () => {

    describe('stop and arithmetic ops', () => {
        it('should STOP successfully', async () => {
            const code = STOP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should ADD two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + ADD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(7)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should ADD with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + ADD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should MUL two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + MUL;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(12)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should MUL with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + MUL;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should SUB two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SUB;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(5)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SUB with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SUB;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should DIV two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + DIV;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(2)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should DIV with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + DIV;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should DIV with zero successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + DIV;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SDIV two numbers successfully', async () => {
            const stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe'; // -6
            const stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SDIV;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(3)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SDIV with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SDIV;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should SDIV with zero successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SDIV;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should MOD a number successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + MOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should MOD a number with zero successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + MOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should MOD with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + MOD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should SMOD a signed number successfully', async () => {
            const stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SMOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SMOD number with zero successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SMOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SMOD with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SMOD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should ADDMOD successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000005';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_2 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + PUSH32 + stack_2 + ADDMOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(3)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should ADDMOD with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + ADDMOD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 4,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0), new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should MULMOD successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000005';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_2 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + PUSH32 + stack_2 + MULMOD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should MULMOD with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + MULMOD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 4,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0), new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should EXP successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + EXP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(81)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should EXP with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + EXP;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('comparison and bitwise ops', () => {

        it('should compute LT of two numbers successfully when true', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000002';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + LT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute LT of two numbers successfully when false', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + LT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should LT with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + LT;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute GT of two numbers successfully when true', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000002';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + GT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute GT of two numbers successfully when false', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + GT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should GT with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + GT;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute SLT of two numbers successfully when true', async () => {
            const stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';
            const stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SLT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute SLT of two numbers successfully when false', async () => {
            const stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
            const stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SLT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SLT with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SLT;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute SGT of two numbers successfully when true', async () => {
            const stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SGT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute SGT of two numbers successfully when false', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SGT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SGT with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SGT;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute EQ of two numbers successfully when true', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + EQ;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute EQ of two numbers successfully when false', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + EQ;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should EQ with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + EQ;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute ISZERO of a number successfully when true', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const code = PUSH32 + stack_0 + ISZERO;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute ISZERO of a number successfully when false', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
            const code = PUSH32 + stack_0 + ISZERO;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should EQ with too few params, resulting in a stack underflow', async () => {
            const code = EQ;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute AND of two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + AND;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should AND with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + AND;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute OR of two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + OR;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(3)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should OR with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + OR;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute XOR of two numbers successfully', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + XOR;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(2)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should XOR with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + XOR;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

        it('should compute NOT of a number successfully', async () => {
            const stack_0 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            const code = PUSH32 + stack_0 + NOT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should NOT with too few params, resulting in a stack underflow', async () => {
            const code = NOT;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should get the 0:th BYTE from a number successfully', async () => {
            const stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000000';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + BYTE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should get the 10:th BYTE from a number successfully', async () => {
            const stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + BYTE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(2)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should return 0 when getting a BYTE out of range', async () => {
            const stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
            const stack_1 = '0000000000000000000000000000000000000000000000000000000000000100';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + BYTE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should BYTE with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + BYTE;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('sha3', () => {

        it('should use SHA3 successfully with 0-size input', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + SHA3;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470", 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use SHA3 successfully with non-zero length input', async () => {
            const code = PUSH1 + '20' + PUSH1 + '00' + SHA3;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber("290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563", 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use SHA3 successfully with large input', async () => {
            const code = PUSH2 + '0500' + PUSH1 + '00' + SHA3;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber("e36384b33d42c0941ec56a16413312b35766b36e5e75c673c1862ae08e6d02ba", 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should SHA3 with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + SHA3;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(0)],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('environmental information', () => {

        it('should use ADDRESS successfully', async () => {
            const code = ADDRESS;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(DEFAULT_CONTRACT_ADDRESS, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use BALANCE successfully', async () => {
            const code = PUSH20 + DEFAULT_CALLER + BALANCE;
            const data = "";
            const input = createTxInput(code, data, 500);
            input.value = new BigNumber(0); // just use createTxInput to not have to set everything.
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(500)
                ],
            };
            await runTestWithInput(input, resExpected);
        });

        it('should use BALANCE with too few params, resulting in a stack underflow', async () => {
            const code = BALANCE;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLER successfully', async () => {
            const code = CALLER;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(DEFAULT_CALLER, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLVALUE successfully', async () => {
            const code = CALLVALUE;
            const data = "";
            const input = createTxInput(code, data, 55, false);
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(55)
                ],
            };
            await runTestWithInput(input, resExpected);
            // prettyPrintResults(result);
        });

        it('should use CALLDATALOAD successfully within the calldata boundary, with no offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "0000000000000000000000000000000000000000000000000000000000000001";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD successfully outside the calldata boundary, with no offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD successfully partially inside the calldata boundary, with no offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "01";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber('0100000000000000000000000000000000000000000000000000000000000000', 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD successfully within the calldata boundary, with offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD successfully outside the calldata boundary, with offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD successfully partially inside the calldata boundary, with offset', async () => {
            const stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
            const code = PUSH32 + stack_0 + CALLDATALOAD;
            const data = "000000000000000000000000000000000000000000000000000000000000000001";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber('0100000000000000000000000000000000000000000000000000000000000000', 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATALOAD with too few params, resulting in a stack underflow', async () => {
            const code = CALLDATALOAD;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATASIZE successfully when zero', async () => {
            const code = CALLDATASIZE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATASIZE successfully when non-zero', async () => {
            const code = CALLDATASIZE;
            const data = "01010101010101";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(7)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATACOPY successfully with zero bytes copied', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + PUSH1 + '00' + CALLDATACOPY;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATACOPY successfully', async () => {
            const code = PUSH1 + '10' + PUSH1 + '08' + PUSH1 + '08' + CALLDATACOPY;
            const data = "0101010101010101020202020202020203030303030303030404040404040404";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: "0000000000000000020202020202020203030303030303030000000000000000",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CALLDATACOPY with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + CALLDATACOPY;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 4,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0),
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CODESIZE successfully', async () => {
            const code = CODESIZE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CODECOPY successfully with zero size', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + PUSH1 + '00' + CODECOPY;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CODECOPY successfully', async () => {
            const code = PUSH1 + '07' + PUSH1 + '00' + PUSH1 + '00' + CODECOPY;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: code + "00000000000000000000000000000000000000000000000000",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use CODECOPY with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + PUSH1 + '00' + CODECOPY;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 4,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0),
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use GASPRICE successfully', async () => {
            const code = GASPRICE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        // TODO EXTCODESIZE, EXTCODECOPY, RETURNDATASIZE, RETURNDATACOPY
        // These should maybe be done directly in solidity
        // There are tests for returndata in solidity contract tests.
    });

    describe('block information', () => {

        it('should use BLOCKHASH successfully', async () => {
            const code = PUSH1 + '00' + BLOCKHASH;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use BLOCKHASH with too few params, resulting in a stack underflow', async () => {
            const code = BLOCKHASH;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use COINBASE successfully', async () => {
            const code = COINBASE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use TIMESTAMP successfully', async () => {
            const code = TIMESTAMP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use NUMBER successfully', async () => {
            const code = NUMBER;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use DIFFICULTY successfully', async () => {
            const code = DIFFICULTY;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use GASLIMIT successfully', async () => {
            const code = GASLIMIT;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('stack, memory, storage and flow ops', () => {

        it('should run PUSH32 three times in a row then pop all three successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + PUSH32 + stack_2 + POP + POP + POP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should POP empty stack and result in a stack underflow', async () => {
            const code = POP;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use MLOAD successfully', async () => {
            const code = PUSH32 + '0000000000000000000000000000000000000000000000000000000000000001' + PUSH1 + '00' + MSTORE + PUSH1 + '00' + MLOAD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                stack: [
                    new BigNumber(1)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use MSTORE successfully', async () => {
            const code = PUSH32 + '0000000000000000000000000000000000000000000000000000000000000001' + PUSH1 + '00' + MSTORE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use MSTORE8 successfully', async () => {
            const code = PUSH32 + '8877665544332211887766554433221188776655443322118877665544332211' + PUSH1 + '00' + MSTORE8;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "1100000000000000000000000000000000000000000000000000000000000000",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use SLOAD successfully', async () => {
            const code = PUSH1 + '02' + PUSH1 + '01' + SSTORE + PUSH1 + '01' + SLOAD;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(2)],
            };
            await runTest(code, data, resExpected);
        });

        it('should use SSTORE successfully', async () => {
            const code = PUSH1 + '02' + PUSH1 + '01' + SSTORE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            const result = await runTest(code, data, resExpected);
            expect(result.errno).toBe(0);
            const storage = result.accounts[1].storage;
            expect(storage[0].address.toNumber()).toBe(1);
            expect(storage[0].value.toNumber()).toBe(2);
        });

        it('should use JUMP successfully', async () => {
            const code = PUSH1 + '05' + JUMP + PUSH1 + '05' + JUMPDEST + STOP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: 6,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should fail JUMP when the jump destination is invalid', async () => {
            const code = PUSH1 + '05' + JUMP + PUSH1 + '05' + STOP;
            const data = "";
            const resExpected = {
                errno: ERROR_INVALID_JUMP_DESTINATION,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use JUMP with too few params, resulting in a stack underflow', async () => {
            const code = JUMP;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 0,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use JUMPI successfully when condition is true', async () => {
            const code = PUSH1 + '01' + PUSH1 + '07' + JUMPI + PUSH1 + '05' + JUMPDEST + STOP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: 8,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use JUMPI successfully when condition is false', async () => {
            const code = PUSH1 + '00' + PUSH1 + '07' + JUMPI + PUSH1 + '05' + JUMPDEST + STOP;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: 8,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [new BigNumber(5)],
            };
            await runTest(code, data, resExpected);
        });

        it('should fail JUMPI when the jump destination is invalid', async () => {
            const code = PUSH1 + '01' + PUSH1 + '07' + JUMPI + PUSH1 + '05' + STOP;
            const data = "";
            const resExpected = {
                errno: ERROR_INVALID_JUMP_DESTINATION,
                errpc: 4,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

        it('should use JUMPI with too few params, resulting in a stack underflow', async () => {
            const code = PUSH1 + '00' + JUMPI;
            const data = "";
            const resExpected = {
                errno: ERROR_STACK_UNDERFLOW,
                errpc: 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use PC successfully', async () => {
            const code = PC + PC + PC;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0),
                    new BigNumber(1),
                    new BigNumber(2)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use MSIZE successfully when memory is empty', async () => {
            const code = MSIZE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use MSIZE successfully when memory is non-empty', async () => {
            const code = PUSH1 + '01' + PUSH1 + '00' + MSTORE + MSIZE;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                stack: [
                    new BigNumber(32)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use GAS successfully', async () => {
            const code = GAS;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(0)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should use JUMPDEST successfully', async () => {
            const code = JUMPDEST;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('push ops', () => {

        it('should run PUSH32 successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const code = PUSH32 + stack_0;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should run PUSH32 three times in a row successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + PUSH32 + stack_2;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_0, 16),
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_2, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should run PUSH1 successfully', async () => {
            const stack_0 = '01';
            const code = PUSH1 + stack_0;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('dup ops', () => {

        it('should run DUP1 successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const code = PUSH32 + stack_0 + DUP1;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_0, 16),
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should run DUP16 sixteen times in a row successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
            const stack_3 = '0101010101010101010101010101010101010101010101010101010101010104';
            const stack_4 = '0101010101010101010101010101010101010101010101010101010101010105';
            const stack_5 = '0101010101010101010101010101010101010101010101010101010101010106';
            const stack_6 = '0101010101010101010101010101010101010101010101010101010101010107';
            const stack_7 = '0101010101010101010101010101010101010101010101010101010101010108';
            const stack_8 = '0101010101010101010101010101010101010101010101010101010101010109';
            const stack_9 = '010101010101010101010101010101010101010101010101010101010101010a';
            const stack_10 = '010101010101010101010101010101010101010101010101010101010101010b';
            const stack_11 = '010101010101010101010101010101010101010101010101010101010101010c';
            const stack_12 = '010101010101010101010101010101010101010101010101010101010101010d';
            const stack_13 = '010101010101010101010101010101010101010101010101010101010101010e';
            const stack_14 = '010101010101010101010101010101010101010101010101010101010101010f';
            const stack_15 = '0101010101010101010101010101010101010101010101010101010101010110';
            const code =
                PUSH32 + stack_0 +
                PUSH32 + stack_1 +
                PUSH32 + stack_2 +
                PUSH32 + stack_3 +
                PUSH32 + stack_4 +
                PUSH32 + stack_5 +
                PUSH32 + stack_6 +
                PUSH32 + stack_7 +
                PUSH32 + stack_8 +
                PUSH32 + stack_9 +
                PUSH32 + stack_10 +
                PUSH32 + stack_11 +
                PUSH32 + stack_12 +
                PUSH32 + stack_13 +
                PUSH32 + stack_14 +
                PUSH32 + stack_15 +
                DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16 +
                DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16 + DUP16;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_0, 16),
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_2, 16),
                    new BigNumber(stack_3, 16),
                    new BigNumber(stack_4, 16),
                    new BigNumber(stack_5, 16),
                    new BigNumber(stack_6, 16),
                    new BigNumber(stack_7, 16),
                    new BigNumber(stack_8, 16),
                    new BigNumber(stack_9, 16),
                    new BigNumber(stack_10, 16),
                    new BigNumber(stack_11, 16),
                    new BigNumber(stack_12, 16),
                    new BigNumber(stack_13, 16),
                    new BigNumber(stack_14, 16),
                    new BigNumber(stack_15, 16),
                    new BigNumber(stack_0, 16),
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_2, 16),
                    new BigNumber(stack_3, 16),
                    new BigNumber(stack_4, 16),
                    new BigNumber(stack_5, 16),
                    new BigNumber(stack_6, 16),
                    new BigNumber(stack_7, 16),
                    new BigNumber(stack_8, 16),
                    new BigNumber(stack_9, 16),
                    new BigNumber(stack_10, 16),
                    new BigNumber(stack_11, 16),
                    new BigNumber(stack_12, 16),
                    new BigNumber(stack_13, 16),
                    new BigNumber(stack_14, 16),
                    new BigNumber(stack_15, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('swap ops', () => {

        it('should run SWAP1 successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SWAP1;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

        it('should run SWAP1 to swap16 successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
            const stack_3 = '0101010101010101010101010101010101010101010101010101010101010104';
            const stack_4 = '0101010101010101010101010101010101010101010101010101010101010105';
            const stack_5 = '0101010101010101010101010101010101010101010101010101010101010106';
            const stack_6 = '0101010101010101010101010101010101010101010101010101010101010107';
            const stack_7 = '0101010101010101010101010101010101010101010101010101010101010108';
            const stack_8 = '0101010101010101010101010101010101010101010101010101010101010109';
            const stack_9 = '010101010101010101010101010101010101010101010101010101010101010a';
            const stack_10 = '010101010101010101010101010101010101010101010101010101010101010b';
            const stack_11 = '010101010101010101010101010101010101010101010101010101010101010c';
            const stack_12 = '010101010101010101010101010101010101010101010101010101010101010d';
            const stack_13 = '010101010101010101010101010101010101010101010101010101010101010e';
            const stack_14 = '010101010101010101010101010101010101010101010101010101010101010f';
            const stack_15 = '0101010101010101010101010101010101010101010101010101010101010110';
            const stack_16 = '0101010101010101010101010101010101010101010101010101010101010111';
            const code =
                PUSH32 + stack_0 +
                PUSH32 + stack_1 +
                PUSH32 + stack_2 +
                PUSH32 + stack_3 +
                PUSH32 + stack_4 +
                PUSH32 + stack_5 +
                PUSH32 + stack_6 +
                PUSH32 + stack_7 +
                PUSH32 + stack_8 +
                PUSH32 + stack_9 +
                PUSH32 + stack_10 +
                PUSH32 + stack_11 +
                PUSH32 + stack_12 +
                PUSH32 + stack_13 +
                PUSH32 + stack_14 +
                PUSH32 + stack_15 +
                PUSH32 + stack_16 +
                SWAP1 + SWAP2 + SWAP3 + SWAP4 + SWAP5 + SWAP6 + SWAP7 + SWAP8 +
                SWAP9 + SWAP10 + SWAP11 + SWAP12 + SWAP13 + SWAP14 + SWAP15 + SWAP16;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_2, 16),
                    new BigNumber(stack_3, 16),
                    new BigNumber(stack_4, 16),
                    new BigNumber(stack_5, 16),
                    new BigNumber(stack_6, 16),
                    new BigNumber(stack_7, 16),
                    new BigNumber(stack_8, 16),
                    new BigNumber(stack_9, 16),
                    new BigNumber(stack_10, 16),
                    new BigNumber(stack_11, 16),
                    new BigNumber(stack_12, 16),
                    new BigNumber(stack_13, 16),
                    new BigNumber(stack_14, 16),
                    new BigNumber(stack_15, 16),
                    new BigNumber(stack_16, 16),
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('swap ops', () => {

        it('should run SWAP1 successfully', async () => {
            const stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
            const stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
            const code = PUSH32 + stack_0 + PUSH32 + stack_1 + SWAP1;
            const data = "";
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 0,
                mem: "",
                stack: [
                    new BigNumber(stack_1, 16),
                    new BigNumber(stack_0, 16)
                ],
            };
            await runTest(code, data, resExpected);
        });

    });

    describe('system ops', () => {

        it('should run CREATE successfully', async () => {
            // CREATE with code that returns '00'. Third account should have '00' as code.
            const code = PUSH32 + '60016000f3000000000000000000000000000000000000000000000000000000' + PUSH1 + '00' + MSTORE + PUSH1 + '05' + PUSH1 + '00' + PUSH1 + '00' + CREATE;
            const data = '';
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: "60016000f3000000000000000000000000000000000000000000000000000000",
                stack: [
                    new BigNumber("5ecfbe86fcd903321c505cb5c8a5de6331e2e7b1", 16)
                ],
            };
            const result = await runTest(code, data, resExpected);
            expect(result.accounts[2].code === "00");
        });

        it('should run CREATE twice, first failed, and only one account should be created', async () => {
            // CREATE failed contract, then a successful one.
            const code = PUSH32 + 'fe00000000000000000000000000000000000000000000000000000000000000' + PUSH1 + '00' + MSTORE + PUSH1 + '05' + PUSH1 + '00' + PUSH1 + '00' + CREATE + PUSH32 + '60016000f3000000000000000000000000000000000000000000000000000000' + PUSH1 + '00' + MSTORE + PUSH1 + '05' + PUSH1 + '00' + PUSH1 + '00' + CREATE;
            const data = '';
            const resExpected = {
                errno: 0,
                errpc: code.length / 2,
                returnData: "",
                memSize: 32,
                mem: "60016000f3000000000000000000000000000000000000000000000000000000",
                stack: [
                    new BigNumber(0),
                    new BigNumber("5ecfbe86fcd903321c505cb5c8a5de6331e2e7b1", 16)
                ],
            };
            const result = await runTest(code, data, resExpected);
            expect(result.accounts[2].code === "00");
        });

    });

});

/* TODO
describe('precompiles', () => {

    it('ecrecover', async () => {
        const code = PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '80' + PUSH1 + '00' + PUSH1 + '01' + PUSH1 + '00' + STATICCALL;
        const data = "";
        const result = await execute(code, data);
        prettyPrintResults(result);
    });

    it('sha256', async () => {
        const code = PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '00' + PUSH1 + '02' + PUSH1 + '00' + STATICCALL;
        const data = "";
        const result = await execute(code, data);
        prettyPrintResults(result);
    });

    it('ripemd160', async () => {
        const code = PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '00' + PUSH1 + '03' + PUSH1 + '00' + STATICCALL;
        const data = "";
        const result = await execute(code, data);
        prettyPrintResults(result);
    });

    it('identity', async () => {
        const code = PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '20' + PUSH1 + '00' + PUSH1 + '04' + PUSH1 + '00' + STATICCALL;
        const data = "";
        const result = await execute(code, data);
        prettyPrintResults(result);
    });

});
*/

describe('solidity contracts', () => {

    it('should call test function on TestContractNoop', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractNoop.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
    });

    it('should call test function on TestContractRetUint', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractRetUint.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000005');
    });

    it('should call test function on TestContractReverts', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractReverts.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(ERROR_STATE_REVERTED);
        expect(result.returnData).toBe('');
    });

    it('should call test function on TestContractRevertsWithArgument', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractRevertsWithArgument.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(ERROR_STATE_REVERTED);
        expect(result.returnData).toBe('08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000');
    });

    it('should call test function on TestContractCallsItself', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCallsItself.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
    });

    it('should call test function on TestContractStorageWrite', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractStorageWrite.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        const storage = result.accounts[1].storage;
        expect(storage.length).toBe(4);
        expect(storage[0].address.eq(new BigNumber(0))).toBeTruthy();
        expect(storage[0].value.eq(new BigNumber(3))).toBeTruthy();
        expect(storage[1].address.eq(new BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563', 16))).toBeTruthy();
        expect(storage[1].value.eq(new BigNumber(0x11))).toBeTruthy();
        expect(storage[2].address.eq(new BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e564', 16))).toBeTruthy();
        expect(storage[2].value.eq(new BigNumber(0x22))).toBeTruthy();
        expect(storage[3].address.eq(new BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e565', 16))).toBeTruthy();
        expect(storage[3].value.eq(new BigNumber(0x33))).toBeTruthy();
        expect(result.returnData).toBe('');

    });

    it('should call test function on TestContractStorageAndInternal', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractStorageAndInternal.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        const storage = result.accounts[1].storage;
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000009');
        expect(storage[0].address.eq(new BigNumber(0))).toBeTruthy();
        expect(storage[0].value.eq(new BigNumber(9))).toBeTruthy();
    });

    it('should create DeployedContractEmpty', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'DeployedContractEmpty.bin'));
        const runtimeCode = readText(path.join(BIN_OUTPUT_PATH, 'DeployedContractEmpty.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.returnData).toEqual(runtimeCode);
        expect(result.errno).toBe(NO_ERROR);
    });

    it('should call test function on TestContractCreate', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCreate.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000005ecfbe86fcd903321c505cb5c8a5de6331e2e7b1');
    });

    it('should call test function on TestContractCreateAndCall', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCreateAndCall.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
    });

    it('should call test function on TestContractCreateAndStaticCall', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCreateAndStaticCall.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
    });

    it('should call test function on TestContractCallchainSameContract', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCallchainSameContract.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000002');
    });

    it('should call test function on TestContractFailedAssertion', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractFailedAssertion.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(ERROR_INVALID_OPCODE);
    });

    it('should call test function on TestContractNoTopicEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractNoTopicEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("1732d0c17008d342618e7f03069177d8d39391d79811bb4e706d7c6c84108c0f", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(0))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(0))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(0))).toBeTruthy();
        expect(log.data).toBe("");
    });

    it('should call test function on TestContractOneTopicEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractOneTopicEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("624fb00c2ce79f34cb543884c3af64816dce0f4cec3d32661959e49d488a7a93", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(5))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(0))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(0))).toBeTruthy();
        expect(log.data).toBe("");
    });

    it('should call test function on TestContractTwoTopicsEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractTwoTopicsEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("ebe57242c74e694c7ec0f2fe9302812f324576f94a505b0de3f0ecb473d149bb", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(5))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(6))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(0))).toBeTruthy();
        expect(log.data).toBe("");

    });

    it('should call test function on TestContractThreeTopicsEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractThreeTopicsEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("8540fe9d62711b26f5d55a228125ce553737daafbb466fb5c89ffef0b5907d14", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(5))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(6))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(7))).toBeTruthy();
        expect(log.data).toBe("");
    });

    it('should call test function on TestContractDataEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractDataEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("7e1e31b207b8694ac24cb269143e8ba879cc2fbc6def5fae514c8783140c48dc", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(0))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(0))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(0))).toBeTruthy();
        expect(log.data).toBe("00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005");
    });

    it('should call test function on TestContractThreeTopicsAndDataEvent', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractThreeTopicsAndDataEvent.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(1);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("e9759a9398e9a2cc19ff163f90583422455643acd0b40fb4561be7d1df63b160", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(5))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(6))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(7))).toBeTruthy();
        expect(log.data).toBe("0000000000000000000000000f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
    });

    it('should call test function on TestContractMultipleThreeTopicsAndDataEvents', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractMultipleThreeTopicsAndDataEvents.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.logs.length).toBe(2);
        const log = result.logs[0];
        expect(log.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log.topics.length).toBe(4);
        expect(log.topics[0].eq(new BigNumber("e9759a9398e9a2cc19ff163f90583422455643acd0b40fb4561be7d1df63b160", 16))).toBeTruthy();
        expect(log.topics[1].eq(new BigNumber(5))).toBeTruthy();
        expect(log.topics[2].eq(new BigNumber(6))).toBeTruthy();
        expect(log.topics[3].eq(new BigNumber(7))).toBeTruthy();
        expect(log.data).toBe("0000000000000000000000000f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        const log2 = result.logs[1];
        expect(log2.account).toBe("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
        expect(log2.topics.length).toBe(4);
        expect(log2.topics[0].eq(new BigNumber("aa2ecc4039583791812ce14fb62fff084d7d4ac354b47128d283d12b9ded2275", 16))).toBeTruthy();
        expect(log2.topics[1].eq(new BigNumber(7))).toBeTruthy();
        expect(log2.topics[2].eq(new BigNumber(8))).toBeTruthy();
        expect(log2.topics[3].eq(new BigNumber(9))).toBeTruthy();
        expect(log2.data).toBe("0000000000000000000000000f572e5295c57f15886f9b263e2f6d2d6c7b5ec6");
    });

    it('should call test function on TestContractPrecompileSha256', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractPrecompileSha256.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('66840dda154e8a113c31dd0ad32f7f3a366a80e8136979d8f5a101d3d29d6f72');
    });

    it('should call test function on TestContractPrecompileRipemd160', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractPrecompileRipemd160.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('c9883eece7dca619b830dc9d87e82c38478111c0000000000000000000000000');
    });

    it('should call test function on TestContractMultipleCreate', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractMultipleCreate.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        // prettyPrintResults(result);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000005');
    });

    it('should call test function on TestContractCreateWithConstructorParams', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCreateWithConstructorParams.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        // prettyPrintResults(result);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005');
    });

    it('should call test function on TestContractCreatesPayable', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCreatesPayable.bin-runtime'));
        const input = createTxInput(code, CONTRACT_TEST_SIG, 3);
        input.value = new BigNumber(2);
        const result = await executeWithTxInput(input);
        // prettyPrintResults(result);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.accounts.length).toBe(3);
        // should spread the 3 wei, 1 to each account.
        for (const acc of result.accounts) {
            expect(acc.balance.eq(1)).toBeTruthy();
        }
    });

    it('should call test function on TestContractSelfDestructs', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractSelfDestructs.bin-runtime'));
        const input = createTxInput(code, CONTRACT_TEST_SIG, 55);
        const result = await executeWithTxInput(input);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.accounts[1].balance.eq(0)).toBeTruthy();
        expect(result.accounts[1].destroyed).toBeTruthy();
    });

    it('should call test function on TestContractCallsB', async () => {
        // Call should set the storage in contract 'TestContractCallsE'
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCallsB.bin-runtime'));
        const input = createTxInput(code, CONTRACT_TEST_SIG);
        const result = await executeWithTxInput(input);
        expect(result.errno).toBe(NO_ERROR);
        const storage = result.accounts[3].storage;
        expect(storage[0].address.eq(0)).toBeTruthy();
        expect(storage[0].value.eq(5)).toBeTruthy();
        expect(storage[1].address.eq(1)).toBeTruthy();
        expect(storage[1].value.eq("5ecfbe86fcd903321c505cb5c8a5de6331e2e7b1", 16)).toBeTruthy();
    });

    it('should call test function on TestContractCallsC', async () => {
        // Delegatecall should set the storage in contract 'TestContractCallsD'
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCallsC.bin-runtime'));
        const input = createTxInput(code, CONTRACT_TEST_SIG);
        const result = await executeWithTxInput(input);
        expect(result.errno).toBe(NO_ERROR);
        const storage = result.accounts[2].storage;
        expect(storage[0].address.eq(0)).toBeTruthy();
        expect(storage[0].value.eq(5)).toBeTruthy();
        expect(storage[1].address.eq(1)).toBeTruthy();
        expect(storage[1].value.eq("0f572e5295c57f15886f9b263e2f6d2d6c7b5ec6", 16)).toBeTruthy();
    });

});

describe('solidity contracts - advanced', () => {

    it('should call test function on TestContractEVMStack', async () => {
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractEVMStack.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
    });
});
