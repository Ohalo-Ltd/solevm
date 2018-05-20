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
var constants_1 = require("../script/constants");
var runTest = function (code, data, resExpected) { return __awaiter(_this, void 0, void 0, function () {
    var result, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, adapter_1.execute(code, data)];
            case 1:
                result = _a.sent();
                console.log(result);
                //console.log(result.stack[0].toNumber());
                expect(result.errno).toEqual(resExpected.errno);
                expect(result.errpc).toEqual(resExpected.errpc);
                expect(result.returnData).toEqual(resExpected.returnData);
                expect(result.mem.length).toEqual(resExpected.mem.length);
                expect(result.mem).toEqual(resExpected.mem);
                expect(result.stack.length).toEqual(resExpected.stack.length);
                for (i = 0; i < result.stack.length; i++) {
                    //console.log(result.stack[i].toString(16));
                    //console.log(resExpected.stack[i].toString(16));
                    expect(result.stack[i].eq(resExpected.stack[i])).toBeTruthy();
                }
                return [2 /*return*/, result];
        }
    });
}); };
/*
describe('arithmetic ops', () => {

    it('should add two numbers successfully', async () => {
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

    it('should multiply two numbers successfully', async () => {
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

    it('should subtract two numbers successfully', async () => {
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

    it('should divide two numbers successfully', async () => {
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

    it('should divide with zero successfully', async () => {
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

    it('should divide two signed numbers successfully', async () => {
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

    it('should signed-divide with zero successfully', async () => {
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

    it('should compute the modulus of a number successfully', async () => {
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

    it('should compute the modulus of a number with zero successfully', async () => {
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

    it('should compute the modulus of a signed number successfully', async () => {
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

    it('should compute the modulus of a signed number with zero successfully', async () => {
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

    it('should compute addmod successfully', async () => {
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

    it('should compute mulmod successfully', async () => {
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

    it('should compute exp successfully', async () => {
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

});

describe('sha3', () => {

    it('should use sha3 successfully', async () => {
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
                DEFAULT_CONTRACT_ADDRESS
            ],
        };
        await runTest(code, data, resExpected);
    });

    it('should use BALANCE successfully', async () => {
        const stack_0 = '0000000000000000000000000000000000000000000000000000000000000000';
        const code = PUSH32 + stack_0 + BALANCE;
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
                DEFAULT_CALLER
            ],
        };
        await runTest(code, data, resExpected);
    });

    it('should use CALLVALUE successfully', async () => {
        const code = CALLVALUE;
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

    it('should use CALLDATASIZE successfully', async () => {
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
*/
describe('stack, memory, storage and flow ops', function () {
    /*
        it('should run push32 three times in a row then pop all three successfully', async () => {
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
    */
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
                    storage = result.accounts[1].storage;
                    expect(storage[0].address.toNumber()).toBe(1);
                    expect(storage[0].value.toNumber()).toBe(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
/*
describe('push ops', () => {

    it('should run push32 successfully', async () => {
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

    it('should run push32 three times in a row successfully', async () => {
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

    it('should run push1 successfully', async () => {
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

    it('should run dup1 successfully', async () => {
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

    it('should run dup16 sixteen times in a row successfully', async () => {
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

    it('should run swap1 successfully', async () => {
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

    it('should run swap1 to swap16 successfully', async () => {
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
*/
