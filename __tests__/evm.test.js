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
var adapter_1 = require("../script/adapter");
var bignumber_js_1 = require("bignumber.js");
var constants_1 = require("../script/constants");
var solc_1 = require("../script/solc");
var path = require("path");
var io_1 = require("../script/io");
beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Compiling contracts.");
                return [4 /*yield*/, solc_1.compile(constants_1.SOL_ETH_SRC, constants_1.BIN_OUTPUT_PATH, true)];
            case 1:
                _a.sent();
                return [4 /*yield*/, solc_1.compile(path.join(constants_1.SRC_PATH, 'testcontracts.sol'), constants_1.BIN_OUTPUT_PATH, true)];
            case 2:
                _a.sent();
                return [4 /*yield*/, solc_1.compile(path.join(constants_1.SRC_PATH, 'testcontracts_advanced.sol'), constants_1.BIN_OUTPUT_PATH, true)];
            case 3:
                _a.sent();
                console.log("Compiling done.");
                return [2 /*return*/];
        }
    });
}); }, 30000);
var runTest = function (code, data, resExpected) { return __awaiter(_this, void 0, void 0, function () {
    var result, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, adapter_1.execute(code, data)];
            case 1:
                result = _a.sent();
                // prettyPrintResults(result);
                // console.log(result);
                // console.log(result.stack[0].toNumber());
                expect(result.errno).toEqual(resExpected.errno);
                expect(result.errpc).toEqual(resExpected.errpc);
                expect(result.returnData).toEqual(resExpected.returnData);
                expect(result.mem.length).toEqual(resExpected.mem.length);
                expect(result.mem).toEqual(resExpected.mem);
                expect(result.stack.length).toEqual(resExpected.stack.length);
                for (i = 0; i < result.stack.length; i++) {
                    // console.log(result.stack[i].toString(16));
                    // console.log(resExpected.stack[i].toString(16));
                    expect(result.stack[i].eq(resExpected.stack[i])).toBeTruthy();
                }
                return [2 /*return*/, result];
        }
    });
}); };
var runTestWithInput = function (input, resExpected) { return __awaiter(_this, void 0, void 0, function () {
    var result, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, adapter_1.executeWithTxInput(input)];
            case 1:
                result = _a.sent();
                // console.log(result);
                // console.log(result.stack[0].toNumber());
                expect(result.errno).toEqual(resExpected.errno);
                expect(result.errpc).toEqual(resExpected.errpc);
                expect(result.returnData).toEqual(resExpected.returnData);
                expect(result.mem.length).toEqual(resExpected.mem.length);
                expect(result.mem).toEqual(resExpected.mem);
                expect(result.stack.length).toEqual(resExpected.stack.length);
                for (i = 0; i < result.stack.length; i++) {
                    // console.log(result.stack[i].toString(16));
                    // console.log(resExpected.stack[i].toString(16));
                    expect(result.stack[i].eq(resExpected.stack[i])).toBeTruthy();
                }
                return [2 /*return*/, result];
        }
    });
}); };
describe('single instructions', function () { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
        describe('stop and arithmetic ops', function () {
            it('should STOP successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ADD two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.ADD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(7)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ADD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.ADD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MUL two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.MUL;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(12)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MUL with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.MUL;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SUB two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SUB;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(5)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SUB with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SUB;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should DIV two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.DIV;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(2)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should DIV with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.DIV;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should DIV with zero successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.DIV;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SDIV two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';
                            stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SDIV;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(3)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SDIV with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SDIV;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SDIV with zero successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000008';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SDIV;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MOD a number successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.MOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MOD a number with zero successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.MOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MOD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.MOD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SMOD a signed number successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SMOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SMOD number with zero successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SMOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SMOD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SMOD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ADDMOD successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000005';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_2 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.PUSH32 + stack_2 + constants_1.ADDMOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(3)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ADDMOD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.ADDMOD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 4,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0), new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MULMOD successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000005';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_2 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.PUSH32 + stack_2 + constants_1.MULMOD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should MULMOD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.MULMOD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 4,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0), new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should EXP successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.EXP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(81)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should EXP with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.EXP;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('comparison and bitwise ops', function () {
            it('should compute LT of two numbers successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000002';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.LT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute LT of two numbers successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.LT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should LT with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.LT;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute GT of two numbers successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000002';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.GT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute GT of two numbers successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.GT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should GT with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.GT;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute SLT of two numbers successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe';
                            stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SLT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute SLT of two numbers successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
                            stack_1 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SLT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SLT with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SLT;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute SGT of two numbers successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SGT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute SGT of two numbers successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SGT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SGT with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SGT;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute EQ of two numbers successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000003';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.EQ;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute EQ of two numbers successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.EQ;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should EQ with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.EQ;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute ISZERO of a number successfully when true', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            code = constants_1.PUSH32 + stack_0 + constants_1.ISZERO;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute ISZERO of a number successfully when false', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000004';
                            code = constants_1.PUSH32 + stack_0 + constants_1.ISZERO;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should EQ with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.EQ;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute AND of two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.AND;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should AND with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.AND;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute OR of two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.OR;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(3)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should OR with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.OR;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute XOR of two numbers successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000003';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000001';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.XOR;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(2)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should XOR with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.XOR;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should compute NOT of a number successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
                            code = constants_1.PUSH32 + stack_0 + constants_1.NOT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should NOT with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.NOT;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should get the 0:th BYTE from a number successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000000';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.BYTE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should get the 10:th BYTE from a number successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000009';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.BYTE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(2)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should return 0 when getting a BYTE out of range', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0102030405060708010203040506070801020304050607080102030405060708';
                            stack_1 = '0000000000000000000000000000000000000000000000000000000000000100';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.BYTE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should BYTE with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.BYTE;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('sha3', function () {
            it('should use SHA3 successfully with 0-size input', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.SHA3;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber("c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470", 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use SHA3 successfully with non-zero length input', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '20' + constants_1.PUSH1 + '00' + constants_1.SHA3;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber("290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563", 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use SHA3 successfully with large input', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH2 + '0500' + constants_1.PUSH1 + '00' + constants_1.SHA3;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber("e36384b33d42c0941ec56a16413312b35766b36e5e75c673c1862ae08e6d02ba", 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should SHA3 with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.SHA3;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(0)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('environmental information', function () {
            it('should use ADDRESS successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.ADDRESS;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(constants_1.DEFAULT_CONTRACT_ADDRESS, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use BALANCE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, input, resExpected, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH20 + constants_1.DEFAULT_CALLER + constants_1.BALANCE;
                            data = "";
                            input = adapter_1.createTxInput(code, data, 500);
                            input.value = new bignumber_js_1.BigNumber(0); // just use createTxInput to not have to set everything.
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(500)
                                ],
                            };
                            return [4 /*yield*/, runTestWithInput(input, resExpected)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use BALANCE with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.BALANCE;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLER successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CALLER;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(constants_1.DEFAULT_CALLER, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLVALUE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, input, resExpected, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CALLVALUE;
                            data = "";
                            input = adapter_1.createTxInput(code, data, 55, false);
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(55)
                                ],
                            };
                            return [4 /*yield*/, runTestWithInput(input, resExpected)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully within the calldata boundary, with no offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "0000000000000000000000000000000000000000000000000000000000000001";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully outside the calldata boundary, with no offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully partially inside the calldata boundary, with no offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "01";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber('0100000000000000000000000000000000000000000000000000000000000000', 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully within the calldata boundary, with offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully outside the calldata boundary, with offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD successfully partially inside the calldata boundary, with offset', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0000000000000000000000000000000000000000000000000000000000000020';
                            code = constants_1.PUSH32 + stack_0 + constants_1.CALLDATALOAD;
                            data = "000000000000000000000000000000000000000000000000000000000000000001";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber('0100000000000000000000000000000000000000000000000000000000000000', 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATALOAD with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CALLDATALOAD;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATASIZE successfully when zero', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CALLDATASIZE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATASIZE successfully when non-zero', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CALLDATASIZE;
                            data = "01010101010101";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(7)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATACOPY successfully with zero bytes copied', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CALLDATACOPY;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATACOPY successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '10' + constants_1.PUSH1 + '08' + constants_1.PUSH1 + '08' + constants_1.CALLDATACOPY;
                            data = "0101010101010101020202020202020203030303030303030404040404040404";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: "0000000000000000020202020202020203030303030303030000000000000000",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CALLDATACOPY with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CALLDATACOPY;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 4,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0),
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CODESIZE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.CODESIZE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CODECOPY successfully with zero size', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CODECOPY;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CODECOPY successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '07' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CODECOPY;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: code + "00000000000000000000000000000000000000000000000000",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use CODECOPY with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CODECOPY;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 4,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0),
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use GASPRICE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.GASPRICE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // TODO EXTCODESIZE, EXTCODECOPY, RETURNDATASIZE, RETURNDATACOPY
            // These should maybe be done directly in solidity
            // There are tests for returndata in solidity contract tests.
        });
        describe('block information', function () {
            it('should use BLOCKHASH successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.BLOCKHASH;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use BLOCKHASH with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.BLOCKHASH;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use COINBASE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.COINBASE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use TIMESTAMP successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.TIMESTAMP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use NUMBER successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.NUMBER;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use DIFFICULTY successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.DIFFICULTY;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use GASLIMIT successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.GASLIMIT;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('stack, memory, storage and flow ops', function () {
            it('should run PUSH32 three times in a row then pop all three successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.PUSH32 + stack_2 + constants_1.POP + constants_1.POP + constants_1.POP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should POP empty stack and result in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.POP;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use MLOAD successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH32 + '0000000000000000000000000000000000000000000000000000000000000001' + constants_1.PUSH1 + '00' + constants_1.MSTORE + constants_1.PUSH1 + '00' + constants_1.MLOAD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                                stack: [
                                    new bignumber_js_1.BigNumber(1)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use MSTORE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH32 + '0000000000000000000000000000000000000000000000000000000000000001' + constants_1.PUSH1 + '00' + constants_1.MSTORE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use MSTORE8 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH32 + '8877665544332211887766554433221188776655443322118877665544332211' + constants_1.PUSH1 + '00' + constants_1.MSTORE8;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "1100000000000000000000000000000000000000000000000000000000000000",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use SLOAD successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '02' + constants_1.PUSH1 + '01' + constants_1.SSTORE + constants_1.PUSH1 + '01' + constants_1.SLOAD;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(2)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use SSTORE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected, result, storage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '02' + constants_1.PUSH1 + '01' + constants_1.SSTORE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            result = _a.sent();
                            expect(result.errno).toBe(0);
                            storage = result.accounts[1].storage;
                            expect(storage[0].address.toNumber()).toBe(1);
                            expect(storage[0].value.toNumber()).toBe(2);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMP successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '05' + constants_1.JUMP + constants_1.PUSH1 + '05' + constants_1.JUMPDEST + constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: 6,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should fail JUMP when the jump destination is invalid', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '05' + constants_1.JUMP + constants_1.PUSH1 + '05' + constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_INVALID_JUMP_DESTINATION,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMP with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.JUMP;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 0,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMPI successfully when condition is true', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '01' + constants_1.PUSH1 + '07' + constants_1.JUMPI + constants_1.PUSH1 + '05' + constants_1.JUMPDEST + constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: 8,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMPI successfully when condition is false', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.PUSH1 + '07' + constants_1.JUMPI + constants_1.PUSH1 + '05' + constants_1.JUMPDEST + constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: 8,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [new bignumber_js_1.BigNumber(5)],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should fail JUMPI when the jump destination is invalid', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '01' + constants_1.PUSH1 + '07' + constants_1.JUMPI + constants_1.PUSH1 + '05' + constants_1.STOP;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_INVALID_JUMP_DESTINATION,
                                errpc: 4,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMPI with too few params, resulting in a stack underflow', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '00' + constants_1.JUMPI;
                            data = "";
                            resExpected = {
                                errno: constants_1.ERROR_STACK_UNDERFLOW,
                                errpc: 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use PC successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PC + constants_1.PC + constants_1.PC;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0),
                                    new bignumber_js_1.BigNumber(1),
                                    new bignumber_js_1.BigNumber(2)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use MSIZE successfully when memory is empty', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.MSIZE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use MSIZE successfully when memory is non-empty', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH1 + '01' + constants_1.PUSH1 + '00' + constants_1.MSTORE + constants_1.MSIZE;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: "0000000000000000000000000000000000000000000000000000000000000001",
                                stack: [
                                    new bignumber_js_1.BigNumber(32)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use GAS successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.GAS;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(0)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use JUMPDEST successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.JUMPDEST;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('push ops', function () {
            it('should run PUSH32 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            code = constants_1.PUSH32 + stack_0;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run PUSH32 three times in a row successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.PUSH32 + stack_2;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_0, 16),
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_2, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run PUSH1 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '01';
                            code = constants_1.PUSH1 + stack_0;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('dup ops', function () {
            it('should run DUP1 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            code = constants_1.PUSH32 + stack_0 + constants_1.DUP1;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_0, 16),
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run DUP16 sixteen times in a row successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, stack_3, stack_4, stack_5, stack_6, stack_7, stack_8, stack_9, stack_10, stack_11, stack_12, stack_13, stack_14, stack_15, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
                            stack_3 = '0101010101010101010101010101010101010101010101010101010101010104';
                            stack_4 = '0101010101010101010101010101010101010101010101010101010101010105';
                            stack_5 = '0101010101010101010101010101010101010101010101010101010101010106';
                            stack_6 = '0101010101010101010101010101010101010101010101010101010101010107';
                            stack_7 = '0101010101010101010101010101010101010101010101010101010101010108';
                            stack_8 = '0101010101010101010101010101010101010101010101010101010101010109';
                            stack_9 = '010101010101010101010101010101010101010101010101010101010101010a';
                            stack_10 = '010101010101010101010101010101010101010101010101010101010101010b';
                            stack_11 = '010101010101010101010101010101010101010101010101010101010101010c';
                            stack_12 = '010101010101010101010101010101010101010101010101010101010101010d';
                            stack_13 = '010101010101010101010101010101010101010101010101010101010101010e';
                            stack_14 = '010101010101010101010101010101010101010101010101010101010101010f';
                            stack_15 = '0101010101010101010101010101010101010101010101010101010101010110';
                            code = constants_1.PUSH32 + stack_0 +
                                constants_1.PUSH32 + stack_1 +
                                constants_1.PUSH32 + stack_2 +
                                constants_1.PUSH32 + stack_3 +
                                constants_1.PUSH32 + stack_4 +
                                constants_1.PUSH32 + stack_5 +
                                constants_1.PUSH32 + stack_6 +
                                constants_1.PUSH32 + stack_7 +
                                constants_1.PUSH32 + stack_8 +
                                constants_1.PUSH32 + stack_9 +
                                constants_1.PUSH32 + stack_10 +
                                constants_1.PUSH32 + stack_11 +
                                constants_1.PUSH32 + stack_12 +
                                constants_1.PUSH32 + stack_13 +
                                constants_1.PUSH32 + stack_14 +
                                constants_1.PUSH32 + stack_15 +
                                constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 +
                                constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16 + constants_1.DUP16;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_0, 16),
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_2, 16),
                                    new bignumber_js_1.BigNumber(stack_3, 16),
                                    new bignumber_js_1.BigNumber(stack_4, 16),
                                    new bignumber_js_1.BigNumber(stack_5, 16),
                                    new bignumber_js_1.BigNumber(stack_6, 16),
                                    new bignumber_js_1.BigNumber(stack_7, 16),
                                    new bignumber_js_1.BigNumber(stack_8, 16),
                                    new bignumber_js_1.BigNumber(stack_9, 16),
                                    new bignumber_js_1.BigNumber(stack_10, 16),
                                    new bignumber_js_1.BigNumber(stack_11, 16),
                                    new bignumber_js_1.BigNumber(stack_12, 16),
                                    new bignumber_js_1.BigNumber(stack_13, 16),
                                    new bignumber_js_1.BigNumber(stack_14, 16),
                                    new bignumber_js_1.BigNumber(stack_15, 16),
                                    new bignumber_js_1.BigNumber(stack_0, 16),
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_2, 16),
                                    new bignumber_js_1.BigNumber(stack_3, 16),
                                    new bignumber_js_1.BigNumber(stack_4, 16),
                                    new bignumber_js_1.BigNumber(stack_5, 16),
                                    new bignumber_js_1.BigNumber(stack_6, 16),
                                    new bignumber_js_1.BigNumber(stack_7, 16),
                                    new bignumber_js_1.BigNumber(stack_8, 16),
                                    new bignumber_js_1.BigNumber(stack_9, 16),
                                    new bignumber_js_1.BigNumber(stack_10, 16),
                                    new bignumber_js_1.BigNumber(stack_11, 16),
                                    new bignumber_js_1.BigNumber(stack_12, 16),
                                    new bignumber_js_1.BigNumber(stack_13, 16),
                                    new bignumber_js_1.BigNumber(stack_14, 16),
                                    new bignumber_js_1.BigNumber(stack_15, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('swap ops', function () {
            it('should run SWAP1 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SWAP1;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run SWAP1 to swap16 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, stack_2, stack_3, stack_4, stack_5, stack_6, stack_7, stack_8, stack_9, stack_10, stack_11, stack_12, stack_13, stack_14, stack_15, stack_16, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            stack_2 = '0101010101010101010101010101010101010101010101010101010101010103';
                            stack_3 = '0101010101010101010101010101010101010101010101010101010101010104';
                            stack_4 = '0101010101010101010101010101010101010101010101010101010101010105';
                            stack_5 = '0101010101010101010101010101010101010101010101010101010101010106';
                            stack_6 = '0101010101010101010101010101010101010101010101010101010101010107';
                            stack_7 = '0101010101010101010101010101010101010101010101010101010101010108';
                            stack_8 = '0101010101010101010101010101010101010101010101010101010101010109';
                            stack_9 = '010101010101010101010101010101010101010101010101010101010101010a';
                            stack_10 = '010101010101010101010101010101010101010101010101010101010101010b';
                            stack_11 = '010101010101010101010101010101010101010101010101010101010101010c';
                            stack_12 = '010101010101010101010101010101010101010101010101010101010101010d';
                            stack_13 = '010101010101010101010101010101010101010101010101010101010101010e';
                            stack_14 = '010101010101010101010101010101010101010101010101010101010101010f';
                            stack_15 = '0101010101010101010101010101010101010101010101010101010101010110';
                            stack_16 = '0101010101010101010101010101010101010101010101010101010101010111';
                            code = constants_1.PUSH32 + stack_0 +
                                constants_1.PUSH32 + stack_1 +
                                constants_1.PUSH32 + stack_2 +
                                constants_1.PUSH32 + stack_3 +
                                constants_1.PUSH32 + stack_4 +
                                constants_1.PUSH32 + stack_5 +
                                constants_1.PUSH32 + stack_6 +
                                constants_1.PUSH32 + stack_7 +
                                constants_1.PUSH32 + stack_8 +
                                constants_1.PUSH32 + stack_9 +
                                constants_1.PUSH32 + stack_10 +
                                constants_1.PUSH32 + stack_11 +
                                constants_1.PUSH32 + stack_12 +
                                constants_1.PUSH32 + stack_13 +
                                constants_1.PUSH32 + stack_14 +
                                constants_1.PUSH32 + stack_15 +
                                constants_1.PUSH32 + stack_16 +
                                constants_1.SWAP1 + constants_1.SWAP2 + constants_1.SWAP3 + constants_1.SWAP4 + constants_1.SWAP5 + constants_1.SWAP6 + constants_1.SWAP7 + constants_1.SWAP8 +
                                constants_1.SWAP9 + constants_1.SWAP10 + constants_1.SWAP11 + constants_1.SWAP12 + constants_1.SWAP13 + constants_1.SWAP14 + constants_1.SWAP15 + constants_1.SWAP16;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_2, 16),
                                    new bignumber_js_1.BigNumber(stack_3, 16),
                                    new bignumber_js_1.BigNumber(stack_4, 16),
                                    new bignumber_js_1.BigNumber(stack_5, 16),
                                    new bignumber_js_1.BigNumber(stack_6, 16),
                                    new bignumber_js_1.BigNumber(stack_7, 16),
                                    new bignumber_js_1.BigNumber(stack_8, 16),
                                    new bignumber_js_1.BigNumber(stack_9, 16),
                                    new bignumber_js_1.BigNumber(stack_10, 16),
                                    new bignumber_js_1.BigNumber(stack_11, 16),
                                    new bignumber_js_1.BigNumber(stack_12, 16),
                                    new bignumber_js_1.BigNumber(stack_13, 16),
                                    new bignumber_js_1.BigNumber(stack_14, 16),
                                    new bignumber_js_1.BigNumber(stack_15, 16),
                                    new bignumber_js_1.BigNumber(stack_16, 16),
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('swap ops', function () {
            it('should run SWAP1 successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var stack_0, stack_1, code, data, resExpected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stack_0 = '0101010101010101010101010101010101010101010101010101010101010101';
                            stack_1 = '0101010101010101010101010101010101010101010101010101010101010102';
                            code = constants_1.PUSH32 + stack_0 + constants_1.PUSH32 + stack_1 + constants_1.SWAP1;
                            data = "";
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 0,
                                mem: "",
                                stack: [
                                    new bignumber_js_1.BigNumber(stack_1, 16),
                                    new bignumber_js_1.BigNumber(stack_0, 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('system ops', function () {
            it('should run CREATE successfully', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH32 + '60016000f3000000000000000000000000000000000000000000000000000000' + constants_1.PUSH1 + '00' + constants_1.MSTORE + constants_1.PUSH1 + '05' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CREATE;
                            data = '';
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: "60016000f3000000000000000000000000000000000000000000000000000000",
                                stack: [
                                    new bignumber_js_1.BigNumber("e795c695551b833dd8abd2bc8bf6c67051b17b44", 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            result = _a.sent();
                            expect(result.accounts[2].code === "00");
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should run CREATE twice, first failed, and only one account should be created', function () { return __awaiter(_this, void 0, void 0, function () {
                var code, data, resExpected, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            code = constants_1.PUSH32 + 'fe00000000000000000000000000000000000000000000000000000000000000' + constants_1.PUSH1 + '00' + constants_1.MSTORE + constants_1.PUSH1 + '05' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CREATE + constants_1.PUSH32 + '60016000f3000000000000000000000000000000000000000000000000000000' + constants_1.PUSH1 + '00' + constants_1.MSTORE + constants_1.PUSH1 + '05' + constants_1.PUSH1 + '00' + constants_1.PUSH1 + '00' + constants_1.CREATE;
                            data = '';
                            resExpected = {
                                errno: 0,
                                errpc: code.length / 2,
                                returnData: "",
                                memSize: 32,
                                mem: "60016000f3000000000000000000000000000000000000000000000000000000",
                                stack: [
                                    new bignumber_js_1.BigNumber(0),
                                    new bignumber_js_1.BigNumber("e795c695551b833dd8abd2bc8bf6c67051b17b44", 16)
                                ],
                            };
                            return [4 /*yield*/, runTest(code, data, resExpected)];
                        case 1:
                            result = _a.sent();
                            expect(result.accounts[2].code === "00");
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return [2 /*return*/];
    });
}); });
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
describe('solidity contracts', function () {
    it('should call test function on TestContractNoop', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractNoop.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractRetUint', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractRetUint.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000005');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractReverts', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractReverts.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.ERROR_STATE_REVERTED);
                    expect(result.returnData).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractRevertsWithArgument', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractRevertsWithArgument.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.ERROR_STATE_REVERTED);
                    expect(result.returnData).toBe('08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000036162630000000000000000000000000000000000000000000000000000000000');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCallsItself', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCallsItself.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractStorageWrite', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractStorageWrite.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    storage = result.accounts[1].storage;
                    // console.log(result);
                    // prettyPrintResults(result);
                    expect(storage.length).toBe(4);
                    expect(storage[0].address.eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(storage[0].value.eq(new bignumber_js_1.BigNumber(3))).toBeTruthy();
                    expect(storage[1].address.eq(new bignumber_js_1.BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563', 16))).toBeTruthy();
                    expect(storage[1].value.eq(new bignumber_js_1.BigNumber(0x11))).toBeTruthy();
                    expect(storage[2].address.eq(new bignumber_js_1.BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e564', 16))).toBeTruthy();
                    expect(storage[2].value.eq(new bignumber_js_1.BigNumber(0x22))).toBeTruthy();
                    expect(storage[3].address.eq(new bignumber_js_1.BigNumber('290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e565', 16))).toBeTruthy();
                    expect(storage[3].value.eq(new bignumber_js_1.BigNumber(0x33))).toBeTruthy();
                    expect(result.returnData).toBe('');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractStorageAndInternal', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractStorageAndInternal.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    storage = result.accounts[1].storage;
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000009');
                    expect(storage[0].address.eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(storage[0].value.eq(new bignumber_js_1.BigNumber(9))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should create DeployedContractEmpty', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, runtimeCode, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'DeployedContractEmpty.bin'));
                    runtimeCode = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'DeployedContractEmpty.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.returnData).toEqual(runtimeCode);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCreate', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCreate.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('000000000000000000000000e795c695551b833dd8abd2bc8bf6c67051b17b44');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCreateAndCall', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCreateAndCall.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCreateAndStaticCall', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCreateAndStaticCall.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCallchainSameContract', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCallchainSameContract.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000002');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractFailedAssertion', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractFailedAssertion.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.ERROR_INVALID_OPCODE);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractNoTopicEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractNoTopicEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("1732d0c17008d342618e7f03069177d8d39391d79811bb4e706d7c6c84108c0f", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.data).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractOneTopicEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractOneTopicEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("624fb00c2ce79f34cb543884c3af64816dce0f4cec3d32661959e49d488a7a93", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(5))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.data).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractTwoTopicsEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractTwoTopicsEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("ebe57242c74e694c7ec0f2fe9302812f324576f94a505b0de3f0ecb473d149bb", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(5))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(6))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.data).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractThreeTopicsEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractThreeTopicsEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("8540fe9d62711b26f5d55a228125ce553737daafbb466fb5c89ffef0b5907d14", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(5))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(6))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(7))).toBeTruthy();
                    expect(log.data).toBe("");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractDataEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractDataEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("7e1e31b207b8694ac24cb269143e8ba879cc2fbc6def5fae514c8783140c48dc", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(0))).toBeTruthy();
                    expect(log.data).toBe("00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractThreeTopicsAndDataEvent', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractThreeTopicsAndDataEvent.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(1);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("e9759a9398e9a2cc19ff163f90583422455643acd0b40fb4561be7d1df63b160", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(5))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(6))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(7))).toBeTruthy();
                    expect(log.data).toBe("0000000000000000000000000101010101010101010101010101010101010101");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractMultipleThreeTopicsAndDataEvents', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result, log, log2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractMultipleThreeTopicsAndDataEvents.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.logs.length).toBe(2);
                    log = result.logs[0];
                    expect(log.account).toBe("0101010101010101010101010101010101010101");
                    expect(log.topics.length).toBe(4);
                    expect(log.topics[0].eq(new bignumber_js_1.BigNumber("e9759a9398e9a2cc19ff163f90583422455643acd0b40fb4561be7d1df63b160", 16))).toBeTruthy();
                    expect(log.topics[1].eq(new bignumber_js_1.BigNumber(5))).toBeTruthy();
                    expect(log.topics[2].eq(new bignumber_js_1.BigNumber(6))).toBeTruthy();
                    expect(log.topics[3].eq(new bignumber_js_1.BigNumber(7))).toBeTruthy();
                    expect(log.data).toBe("0000000000000000000000000101010101010101010101010101010101010101");
                    log2 = result.logs[1];
                    expect(log2.account).toBe("0101010101010101010101010101010101010101");
                    expect(log2.topics.length).toBe(4);
                    expect(log2.topics[0].eq(new bignumber_js_1.BigNumber("aa2ecc4039583791812ce14fb62fff084d7d4ac354b47128d283d12b9ded2275", 16))).toBeTruthy();
                    expect(log2.topics[1].eq(new bignumber_js_1.BigNumber(7))).toBeTruthy();
                    expect(log2.topics[2].eq(new bignumber_js_1.BigNumber(8))).toBeTruthy();
                    expect(log2.topics[3].eq(new bignumber_js_1.BigNumber(9))).toBeTruthy();
                    expect(log2.data).toBe("0000000000000000000000000101010101010101010101010101010101010101");
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractPrecompileSha256', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractPrecompileSha256.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('66840dda154e8a113c31dd0ad32f7f3a366a80e8136979d8f5a101d3d29d6f72');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractPrecompileRipemd160', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractPrecompileRipemd160.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('c9883eece7dca619b830dc9d87e82c38478111c0000000000000000000000000');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractMultipleCreate', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractMultipleCreate.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000005');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCreateWithConstructorParams', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCreateWithConstructorParams.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.returnData).toBe('00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000005');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCreatesPayable', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, data, input, result, _i, _a, acc;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCreatesPayable.bin-runtime'));
                    data = constants_1.CONTRACT_TEST_SIG;
                    input = adapter_1.createTxInput(code, data, 3);
                    input.value = new bignumber_js_1.BigNumber(2);
                    return [4 /*yield*/, adapter_1.executeWithTxInput(input)];
                case 1:
                    result = _b.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.accounts.length).toBe(3);
                    // should spread the 3 wei, 1 to each account.
                    for (_i = 0, _a = result.accounts; _i < _a.length; _i++) {
                        acc = _a[_i];
                        expect(acc.balance.eq(1)).toBeTruthy();
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractSelfDestructs', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, data, input, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractSelfDestructs.bin-runtime'));
                    data = constants_1.CONTRACT_TEST_SIG;
                    input = adapter_1.createTxInput(code, data, 55);
                    return [4 /*yield*/, adapter_1.executeWithTxInput(input)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    expect(result.accounts[1].balance.eq(0)).toBeTruthy();
                    expect(result.accounts[1].destroyed).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCallsB', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, data, input, result, storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCallsB.bin-runtime'));
                    data = constants_1.CONTRACT_TEST_SIG;
                    input = adapter_1.createTxInput(code, data);
                    return [4 /*yield*/, adapter_1.executeWithTxInput(input)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    storage = result.accounts[3].storage;
                    expect(storage[0].address.eq(0)).toBeTruthy();
                    expect(storage[0].value.eq(5)).toBeTruthy();
                    expect(storage[1].address.eq(1)).toBeTruthy();
                    expect(storage[1].value.eq("e795c695551b833dd8abd2bc8bf6c67051b17b44", 16)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call test function on TestContractCallsC', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, data, input, result, storage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractCallsC.bin-runtime'));
                    data = constants_1.CONTRACT_TEST_SIG;
                    input = adapter_1.createTxInput(code, data);
                    return [4 /*yield*/, adapter_1.executeWithTxInput(input)];
                case 1:
                    result = _a.sent();
                    // prettyPrintResults(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    storage = result.accounts[2].storage;
                    expect(storage[0].address.eq(0)).toBeTruthy();
                    expect(storage[0].value.eq(5)).toBeTruthy();
                    expect(storage[1].address.eq(1)).toBeTruthy();
                    expect(storage[1].value.eq("101010101010101010101010101010101010101", 16)).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('solidity contracts - advanced', function () {
    it('should call test function on TestContractEVMStack', function () { return __awaiter(_this, void 0, void 0, function () {
        var code, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    code = io_1.readText(path.join(constants_1.BIN_OUTPUT_PATH, 'TestContractEVMStack.bin-runtime'));
                    return [4 /*yield*/, adapter_1.execute(code, constants_1.CONTRACT_TEST_SIG)];
                case 1:
                    result = _a.sent();
                    // console.log(result);
                    expect(result.errno).toBe(constants_1.NO_ERROR);
                    return [2 /*return*/];
            }
        });
    }); });
});
