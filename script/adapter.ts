import {
    DEFAULT_CALLER,
    DEFAULT_CONTRACT_ADDRESS,
    EVM_EXECUTE_SIG,
    EVM_EXECUTE_TXINPUT_SIG,
    SOL_ETH_BIN
} from "./constants";
const Web3EthAbi = require('web3-eth-abi');
import {BigNumber} from "bignumber.js";
import {run} from "./evm";

const BN_ZERO = new BigNumber(0);
const ZERO_ACCOUNT = '0000000000000000000000000000000000000000';

export const decode = (res) => {
    res = res.substr(64);
    const dec = Web3EthAbi.decodeParameters(['uint256', 'uint256', 'bytes', 'uint256[]', 'bytes', 'uint256[]', 'bytes', 'uint256[]', 'bytes'], '0x' + res);
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

    let accsCode = '';
    if (dec['6'] && dec['6'].length >= 2) {
        accsCode = dec['6'].substr(2);
    }
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
        const destroyed = new BigNumber(accsArr[offset + 3]).toNumber() == 1;
        const codeIdx = new BigNumber(accsArr[offset + 4]).toNumber();
        const codeSize = new BigNumber(accsArr[offset + 5]).toNumber();
        const code = accsCode.substr(2*codeIdx, 2*codeSize);
        const storageSize = new BigNumber(accsArr[offset + 6]).toNumber();
        const storage = [];
        for (let j = 0; j < storageSize; j++) {
            const address = new BigNumber(accsArr[offset + 7 + 2*j]);
            const value = new BigNumber(accsArr[offset + 7 + 2*j + 1]);
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
            destroyed: destroyed,
            code: code,
            storage: storage
        });

        offset += 7 + 2*storageSize;
    }

    const logsArr = dec['7'];
    let logsCode = '';
    if (dec['8'] && dec['8'].length >= 2) {
        logsCode = dec['8'].substr(2);
    }

    const logs = [];
    offset = 0;

    while(offset < logsArr.length) {
        let addr = new BigNumber(logsArr[offset]).toString(16);
        while(addr.length < 40) {
            addr = '0' + addr;
        }
        const topics = [];
        topics.push(new BigNumber(logsArr[offset + 1]));
        topics.push(new BigNumber(logsArr[offset + 2]));
        topics.push(new BigNumber(logsArr[offset + 3]));
        topics.push(new BigNumber(logsArr[offset + 4]));
        const dataIdx = new BigNumber(logsArr[offset + 5]).toNumber();
        const dataSize = new BigNumber(logsArr[offset + 6]).toNumber();
        const data = logsCode.substr(2*dataIdx, 2*dataSize);

        logs.push({
            account: addr,
            topics: topics,
            data: data
        });

        offset += 7;
    }

    return {
        errno: new BigNumber(dec['0']).toNumber(),
        errpc: new BigNumber(dec['1']).toNumber(),
        returnData: returnData,
        stack: stack,
        mem: mem,
        accounts: accs,
        logs: logs
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

export const newDefaultTxInput = () => {
    return {
        gas: BN_ZERO,
        gasPrice: BN_ZERO,
        caller: DEFAULT_CALLER,
        callerBalance: BN_ZERO,
        value: BN_ZERO,
        target: DEFAULT_CONTRACT_ADDRESS,
        targetBalance: BN_ZERO,
        targetCode: '',
        data: '',
        staticExec: false
    }
};

export const createTxInput = (code, data, value = 0, staticExec = false) => {
    return {
        gas: BN_ZERO,
        gasPrice: BN_ZERO,
        caller: DEFAULT_CALLER,
        callerBalance: value, // set sending account balance to the value.
        value: value,
        target: DEFAULT_CONTRACT_ADDRESS,
        targetBalance: BN_ZERO,
        targetCode: code,
        data: data,
        staticExec: staticExec
    }
};

export const executeWithTxInput = async (txInput) => {
    let calldata = EVM_EXECUTE_TXINPUT_SIG + '0000000000000000000000000000000000000000000000000000000000000020' +
        Web3EthAbi.encodeParameters(
            ['uint256', 'uint256', 'address', 'uint256', 'uint256', 'address', 'uint256', 'bytes', 'bytes', 'bool'],
            [txInput.gas, txInput.gasPrice, '0x' + txInput.caller, txInput.callerBalance, txInput.value,
                '0x' + txInput.target, txInput.targetBalance, '0x' + txInput.targetCode, '0x' + txInput.data, txInput.staticExec]).substr(2);
    //console.log(calldata);
    const res = run(SOL_ETH_BIN, calldata);
    //console.log(res);
    if (res === '0') {
        throw new Error("Error when executing - no return data.");
    }
    return decode(res);
};

export const printStorage = (storage) => {
    console.log("Storage:");
    for (let slot of storage) {
        console.log(`address: ${slot.address.toString(16)}`);
        console.log(`value: ${slot.value.toString(16)}`);
    }
};

export const printStack = (stack) => {
    console.log("Stack:");
    for (let elem of stack) {
        console.log(`${elem.toString(16)}`);
    }
};

export const prettyPrintResults = (result) => {
    const resultF = {};
    resultF['errno'] = result.errno;
    resultF['errpc'] = result.errpc;
    resultF['returnData'] = result.returnData;
    resultF['mem'] = result.mem;
    const stackF = [];
    let i = 0;
    for (let stackItem of result.stack) {
        stackF.push(`${i++}: ${stackItem.toString(16)}`);
    }
    resultF['stack'] = stackF;

    const accountsF = [];
    for (let account of result.accounts) {
        const accountF = {};
        accountF['address'] = account.address;
        accountF['balance'] = account.balance.toString(16);
        accountF['nonce'] = account.nonce;
        accountF['code'] = account.code;

        const storageF = [];
        for (let item of account.storage) {
            storageF.push({
                address: item.address.toString(16),
                value: item.value.toString(16)
            });
        }
        accountF['storage'] = storageF;
        accountF['destroyed'] = account.destroyed;
        accountsF.push(accountF);
    }
    resultF['accounts'] = accountsF;

    const logsF = [];
    //console.log(result.logs);
    for (let log of result.logs) {
        const logF = {};
        logF['account'] = log.account;
        logF['topics'] = [];
        for(let i = 0; i < log.topics.length; i++) {
            logF['topics'].push(log.topics[i].toString(16));
        }
        logF['data'] = log.data;
        logsF.push(logF);
    }
    resultF['logs'] = logsF;

    console.log(JSON.stringify(resultF, null, '\t'));
};
