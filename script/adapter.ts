import {EVM_EXECUTE_SIG, SOL_ETH_BIN} from "./constants";
const Web3EthAbi = require('web3-eth-abi');
import {BigNumber} from "bignumber.js";
import {run} from "./evm";

const BN_ZERO = new BigNumber(0);
const ZERO_ACCOUNT = '0000000000000000000000000000000000000000';

export const pad = (hex, numBytes) => {
    const hl = hex.length / 2;
    if (hl > numBytes) {
        throw new Error("Numbytes less than string length.");
    }
    if (hl < numBytes) {
        for (let i = 0; i < numBytes - hl; i++) {
            hex = "00" + hex;
        }
    }
    return hex;
};

export const numToHex = (int: number, numBytes: number) => {
    // TODO guards
    let hex = int.toString(16);
    if (hex.length % 2 == 1) {
        hex = '0' + hex;
    }
    return pad(hex, numBytes);
};

export const bytesHexToABI = (btsHex) => {
    const header = numToHex(btsHex.length / 2, 32);
    //console.log(header);
    const btsLength = Math.floor((btsHex.length / 2 + 31) / 32) * 32;
    const hexLength = btsLength * 2;
    while (btsHex.length != hexLength) {
        btsHex += "00";
    }
    //console.log(btsHex);
    return header + btsHex;
};

export const decode = (res) => {

    res = res.substr(64);
    const dec = Web3EthAbi.decodeParameters(['uint256', 'uint256', 'bytes', 'uint256[]', 'bytes', 'uint256[]', 'bytes[]'], '0x' + res);
    //console.log(dec);
    let returnData = '';
    if (dec['2'] && dec['2'].length >= 2) {
        returnData = dec['2'].substr(2);
    }

    const stackIn = dec['3'];
    const stack = [];

    for (let i = 0; i < stackIn.length; i++) {
        stack.push(new BigNumber(stackIn[i]));
    }

    let mem = '';
    if (dec['4'] && dec['4'].length >= 2) {
        mem = dec['4'].substr(2);
    }

    const accsArr = dec['5'];
    //console.log(accsArr.length);
    const accs = [];
    let offset = 0;

    while(offset < accsArr.length) {
        let addr = new BigNumber(accsArr[offset]).toString(16);
        while(addr.length < 40) {
            addr = '0' + addr;
        }
        const balance = new BigNumber(accsArr[offset + 1]);
        const nonce = new BigNumber(accsArr[offset + 2]).toNumber();
        const storageSize = new BigNumber(accsArr[offset + 3]).toNumber();
        const storage = [];
        for (let j = 0; j < storageSize; j++) {
            const address = new BigNumber(accsArr[offset + 4 + 2*j]);
            const value = new BigNumber(accsArr[offset + 4 + 2*j + 1]);
            if (!value.eq(BN_ZERO)) {
                storage.push({
                    address: address,
                    value: value
                });
            }
        }
        accs.push({
            address: addr,
            balance: balance,
            nonce: nonce,
            storage: storage
        });

        offset += 4 + 2*storageSize;
    }

    return {
        errno: new BigNumber(dec['0']).toNumber(),
        errpc: new BigNumber(dec['1']).toNumber(),
        returnData: returnData,
        stack: stack,
        mem: mem,
        accounts: accs
    }
};

export const execute = async (code, data) => {
    let calldata = EVM_EXECUTE_SIG + Web3EthAbi.encodeParameters(['bytes', 'bytes'], ['0x' + code, '0x' + data]).substr(2);
    //console.log(calldata);
    const res = run(SOL_ETH_BIN, calldata);
    //console.log(res);
    if (res === '0') {
        throw new Error("Error when executing - no return data.");
    }
    return decode(res);
};

/*
    struct TxInput {
        uint gas;
        uint gasPrice;
        address caller;
        uint callerBalance;
        uint callerNonce;
        uint value;
        address target;
        uint targetBalance;
        uint targetNonce;
        bytes targetCode;
        bytes data;
    }
 */

export const newTxInput = async () => {
    return {
        gas: BN_ZERO,
        gasPrice: BN_ZERO,
        caller: ZERO_ACCOUNT,
        callerBalance: BN_ZERO,
        callerNonce: BN_ZERO,
        value: BN_ZERO,
        target: ZERO_ACCOUNT,
        targetBalance: BN_ZERO,
        targetNonce: BN_ZERO,
        targetCode: '',
        targetData: ''
    }
};

export const executeWithTxInput = async (txInput) => {
    let calldata = EVM_EXECUTE_SIG + '0000000000000000000000000000000000000000000000000000000000000020' +
        Web3EthAbi.encodeParameters(
            ['uint256', 'uint256', 'address', 'uint256', 'uint256', 'uint256', 'uint256', 'address', 'uint256', 'uint256', 'bytes', 'bytes'],
            [txInput.gas, txInput.gasPrice, '0x' + txInput.caller, txInput.callerBalance, txInput.callerNonce, txInput.value,
                '0x' + txInput.target, txInput.targetBalance, txInput.targetNonce, '0x' + txInput.targetCode, '0x' + txInput.data]).substr(2);
    //console.log(calldata);
    const res = run(SOL_ETH_BIN, calldata);
    //console.log(res);
    if (res === '0') {
        throw new Error("Error when executing - no return data.");
    }
    return decode(res);
};

export const printStorage = (storage) => {
    for (let slot of storage) {
        console.log(`address: ${slot.address.toString(16)}`);
        console.log(`value: ${slot.value.toString(16)}`);
    }
};