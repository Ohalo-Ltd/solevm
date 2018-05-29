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
var path = require("path");
var constants_1 = require("./constants");
var io_1 = require("./io");
var evm_1 = require("./evm");
var test_logger_1 = require("./test_logger");
var solc_1 = require("./solc");
exports.runPerfs = function (perfs) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                io_1.ensureAndClear(constants_1.BIN_OUTPUT_PATH);
                return [4 /*yield*/, exports.compileAndRunPerfs(perfs, true)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.compileAndRunPerfs = function (units, optimize) { return __awaiter(_this, void 0, void 0, function () {
    var results, _i, units_1, unit;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, solc_1.compileContracts(units, optimize)];
            case 1:
                _a.sent();
                results = [];
                test_logger_1.default.header("\n");
                test_logger_1.default.header("Running perf");
                test_logger_1.default.header("\n");
                for (_i = 0, units_1 = units; _i < units_1.length; _i++) {
                    unit = units_1[_i];
                    results.push(exports.runPerf(unit));
                }
                test_logger_1.default.header("Done");
                return [2 /*return*/];
        }
    });
}); };
exports.runPerf = function (unit) {
    var funcs = io_1.parseSigFile(unit);
    var binPath = path.join(constants_1.BIN_OUTPUT_PATH, unit + ".bin-runtime");
    var tests = 0;
    var failed = 0;
    test_logger_1.default.info("" + unit);
    for (var func in funcs) {
        if (funcs.hasOwnProperty(func)) {
            var fName = funcs[func].trim();
            if (fName.length < 4 || fName.substr(0, 4) !== "perf") {
                continue;
            }
            var result = parseData(evm_1.run(binPath, func));
            test_logger_1.default.perfResult(fName, result);
        }
    }
    test_logger_1.default.info("");
};
var parseData = function (output) { return parseInt(output, 16); };
