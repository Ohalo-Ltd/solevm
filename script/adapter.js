"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var Web3EthAbi = require('web3-eth-abi');
var bignumber_js_1 = require("bignumber.js");
var evm_1 = require("./evm");
var BN_ZERO = new bignumber_js_1.BigNumber(0);
var ZERO_ACCOUNT = '0000000000000000000000000000000000000000';
exports.decode = function (res) {
    res = res.substr(64);
    var dec = Web3EthAbi.decodeParameters(['uint256', 'uint256', 'bytes', 'uint256[]', 'bytes', 'uint256[]', 'bytes', 'uint256[]', 'bytes'], '0x' + res);
    //console.log(dec);
    var returnData = '';
    if (dec['2'] && dec['2'].length >= 2) {
        returnData = dec['2'].substr(2);
    }
    var stackIn = dec['3'];
    var stack = [];
    for (var i = 0; i < stackIn.length; i++) {
        stack.push(new bignumber_js_1.BigNumber(stackIn[i]));
    }
    var mem = '';
    if (dec['4'] && dec['4'].length >= 2) {
        mem = dec['4'].substr(2);
    }
    var accsArr = dec['5'];
    var accsCode = '';
    if (dec['6'] && dec['6'].length >= 2) {
        accsCode = dec['6'].substr(2);
    }
    //console.log(accsArr.length);
    var accs = [];
    var offset = 0;
    while (offset < accsArr.length) {
        var addr = new bignumber_js_1.BigNumber(accsArr[offset]).toString(16);
        while (addr.length < 40) {
            addr = '0' + addr;
        }
        var balance = new bignumber_js_1.BigNumber(accsArr[offset + 1]);
        var nonce = new bignumber_js_1.BigNumber(accsArr[offset + 2]).toNumber();
        var destroyed = new bignumber_js_1.BigNumber(accsArr[offset + 3]).toNumber() == 1;
        var codeIdx = new bignumber_js_1.BigNumber(accsArr[offset + 4]).toNumber();
        var codeSize = new bignumber_js_1.BigNumber(accsArr[offset + 5]).toNumber();
        var code = accsCode.substr(2 * codeIdx, 2 * codeSize);
        var storageSize = new bignumber_js_1.BigNumber(accsArr[offset + 6]).toNumber();
        var storage = [];
        for (var j = 0; j < storageSize; j++) {
            var address = new bignumber_js_1.BigNumber(accsArr[offset + 7 + 2 * j]);
            var value = new bignumber_js_1.BigNumber(accsArr[offset + 7 + 2 * j + 1]);
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
        offset += 7 + 2 * storageSize;
    }
    var logsArr = dec['7'];
    var logsCode = '';
    if (dec['8'] && dec['8'].length >= 2) {
        logsCode = dec['8'].substr(2);
    }
    var logs = [];
    offset = 0;
    while (offset < logsArr.length) {
        var addr = new bignumber_js_1.BigNumber(logsArr[offset]).toString(16);
        while (addr.length < 40) {
            addr = '0' + addr;
        }
        var topics = [];
        topics.push(new bignumber_js_1.BigNumber(logsArr[offset + 1]));
        topics.push(new bignumber_js_1.BigNumber(logsArr[offset + 2]));
        topics.push(new bignumber_js_1.BigNumber(logsArr[offset + 3]));
        topics.push(new bignumber_js_1.BigNumber(logsArr[offset + 4]));
        var dataIdx = new bignumber_js_1.BigNumber(logsArr[offset + 5]).toNumber();
        var dataSize = new bignumber_js_1.BigNumber(logsArr[offset + 6]).toNumber();
        var data = logsCode.substr(2 * dataIdx, 2 * dataSize);
        logs.push({
            account: addr,
            topics: topics,
            data: data
        });
        offset += 7;
    }
    return {
        errno: new bignumber_js_1.BigNumber(dec['0']).toNumber(),
        errpc: new bignumber_js_1.BigNumber(dec['1']).toNumber(),
        returnData: returnData,
        stack: stack,
        mem: mem,
        accounts: accs,
        logs: logs
    };
};
exports.execute = function (code, data) { return __awaiter(_this, void 0, void 0, function () {
    var calldata, res;
    return __generator(this, function (_a) {
        calldata = constants_1.EVM_EXECUTE_SIG + Web3EthAbi.encodeParameters(['bytes', 'bytes'], ['0x' + code, '0x' + data]).substr(2);
        res = evm_1.run(constants_1.SOL_ETH_BIN, calldata);
        //console.log(res);
        if (res === '0') {
            throw new Error("Error when executing - no return data.");
        }
        return [2 /*return*/, exports.decode(res)];
    });
}); };
exports.newDefaultTxInput = function () {
    return {
        gas: BN_ZERO,
        gasPrice: BN_ZERO,
        caller: constants_1.DEFAULT_CALLER,
        callerBalance: BN_ZERO,
        value: BN_ZERO,
        target: constants_1.DEFAULT_CONTRACT_ADDRESS,
        targetBalance: BN_ZERO,
        targetCode: '',
        data: '',
        staticExec: false
    };
};
exports.createTxInput = function (code, data, value, staticExec) {
    if (value === void 0) { value = 0; }
    if (staticExec === void 0) { staticExec = false; }
    return {
        gas: BN_ZERO,
        gasPrice: BN_ZERO,
        caller: constants_1.DEFAULT_CALLER,
        callerBalance: value,
        value: value,
        target: constants_1.DEFAULT_CONTRACT_ADDRESS,
        targetBalance: BN_ZERO,
        targetCode: code,
        data: data,
        staticExec: staticExec
    };
};
exports.executeWithTxInput = function (txInput) { return __awaiter(_this, void 0, void 0, function () {
    var calldata, res;
    return __generator(this, function (_a) {
        calldata = constants_1.EVM_EXECUTE_TXINPUT_SIG + '0000000000000000000000000000000000000000000000000000000000000020' +
            Web3EthAbi.encodeParameters(['uint256', 'uint256', 'address', 'uint256', 'uint256', 'address', 'uint256', 'bytes', 'bytes', 'bool'], [txInput.gas, txInput.gasPrice, '0x' + txInput.caller, txInput.callerBalance, txInput.value,
                '0x' + txInput.target, txInput.targetBalance, '0x' + txInput.targetCode, '0x' + txInput.data, txInput.staticExec]).substr(2);
        res = evm_1.run(constants_1.SOL_ETH_BIN, calldata);
        //console.log(res);
        if (res === '0') {
            throw new Error("Error when executing - no return data.");
        }
        return [2 /*return*/, exports.decode(res)];
    });
}); };
exports.printStorage = function (storage) {
    console.log("Storage:");
    for (var _i = 0, storage_1 = storage; _i < storage_1.length; _i++) {
        var slot = storage_1[_i];
        console.log("address: " + slot.address.toString(16));
        console.log("value: " + slot.value.toString(16));
    }
};
exports.printStack = function (stack) {
    console.log("Stack:");
    for (var _i = 0, stack_1 = stack; _i < stack_1.length; _i++) {
        var elem = stack_1[_i];
        console.log("" + elem.toString(16));
    }
};
exports.prettyPrintResults = function (result) {
    var resultF = {};
    resultF['errno'] = result.errno;
    resultF['errpc'] = result.errpc;
    resultF['returnData'] = result.returnData;
    resultF['mem'] = result.mem;
    var stackF = [];
    var i = 0;
    for (var _i = 0, _a = result.stack; _i < _a.length; _i++) {
        var stackItem = _a[_i];
        stackF.push(i++ + ": " + stackItem.toString(16));
    }
    resultF['stack'] = stackF;
    var accountsF = [];
    for (var _b = 0, _c = result.accounts; _b < _c.length; _b++) {
        var account = _c[_b];
        var accountF = {};
        accountF['address'] = account.address;
        accountF['balance'] = account.balance.toString(16);
        accountF['nonce'] = account.nonce;
        accountF['code'] = account.code;
        var storageF = [];
        for (var _d = 0, _e = account.storage; _d < _e.length; _d++) {
            var item = _e[_d];
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
    var logsF = [];
    //console.log(result.logs);
    for (var _f = 0, _g = result.logs; _f < _g.length; _f++) {
        var log = _g[_f];
        var logF = {};
        logF['account'] = log.account;
        logF['topics'] = [];
        for (var i_1 = 0; i_1 < log.topics.length; i_1++) {
            logF['topics'].push(log.topics[i_1].toString(16));
        }
        logF['data'] = log.data;
        logsF.push(logF);
    }
    resultF['logs'] = logsF;
    console.log(JSON.stringify(resultF, null, '\t'));
};
