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
var io_1 = require("./io");
var path = require("path");
var adapter_1 = require("./adapter");
var bignumber_js_1 = require("bignumber.js");
exports.readVMTests = function (testDir) {
    var tests = {};
    var vmTestDir = path.join(testDir, "VMTests");
    var arithFiles = io_1.filesInFolder(path.join(vmTestDir, 'vmArithmeticTest'), '.json');
    var arithObjs = [];
    for (var _i = 0, arithFiles_1 = arithFiles; _i < arithFiles_1.length; _i++) {
        var af = arithFiles_1[_i];
        arithObjs.push(io_1.readJSON(af));
    }
    tests["vmArithmeticTest"] = arithObjs;
    var bLogFiles = io_1.filesInFolder(path.join(vmTestDir, 'vmBitwiseLogicOperation'), '.json');
    var bLogObjs = [];
    for (var _a = 0, bLogFiles_1 = bLogFiles; _a < bLogFiles_1.length; _a++) {
        var bf = bLogFiles_1[_a];
        bLogObjs.push(io_1.readJSON(bf));
    }
    tests["vmBitwiseLogicOperation"] = arithObjs;
    return tests;
};
exports.runVMTest = function (testObj) { return __awaiter(_this, void 0, void 0, function () {
    var txInput, exec, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                txInput = adapter_1.newDefaultTxInput();
                exec = testObj.exec;
                if (!exec.caller || exec.caller.length < 2) {
                    throw new Error("No caller address");
                }
                txInput.caller = exec.caller.substr(2);
                if (!exec.address || exec.address.length < 2) {
                    throw new Error("No target address");
                }
                txInput.target = exec.address.substr(2);
                if (exec.value && exec.value.length >= 2) {
                    txInput.value = new bignumber_js_1.BigNumber(exec.value.substr(2), 16);
                    txInput.callerBalance = txInput.value;
                }
                if (exec.code && exec.code.length > 2) {
                    txInput.targetCode = exec.code.substr(2);
                }
                else {
                    txInput.targetCode = '';
                }
                if (exec.data && exec.data.length > 2) {
                    txInput.data = exec.data.substr(2);
                }
                else {
                    txInput.data = '';
                }
                return [4 /*yield*/, adapter_1.executeWithTxInput(txInput)];
            case 1:
                result = _a.sent();
                adapter_1.prettyPrintResults(result);
                return [2 /*return*/];
        }
    });
}); };
