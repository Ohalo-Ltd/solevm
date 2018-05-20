"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var io_1 = require("./io");
var TestLogger = /** @class */ (function () {
    function TestLogger() {
    }
    TestLogger.header = function (text) {
        io_1.println(chalk["cyanBright"](text));
    };
    TestLogger.info = function (text) {
        if (!TestLogger._silent) {
            io_1.println(chalk["blueBright"](text));
        }
    };
    TestLogger.success = function (text) {
        if (!TestLogger._silent) {
            io_1.println(chalk["greenBright"](text));
        }
    };
    TestLogger.moderate = function (text) {
        if (!TestLogger._silent) {
            io_1.println(chalk["yellowBright"](text));
        }
    };
    TestLogger.fail = function (text) {
        io_1.println(chalk["redBright"](text));
    };
    TestLogger.testResult = function (fName, success) {
        if (!TestLogger._silent) {
            var color = success ? "greenBright" : "redBright";
            var result = success ? "PASSED" : "FAILED";
            io_1.println(chalk["white"](fName) + ": " + chalk[color](result));
        }
    };
    TestLogger.perfResult = function (fName, gas) {
        if (!TestLogger._silent) {
            io_1.println(chalk["white"](fName) + ": " + chalk["greenBright"](gas));
        }
    };
    TestLogger.setSilent = function (silent) {
        TestLogger._silent = silent;
    };
    TestLogger.silent = function () {
        return TestLogger._silent;
    };
    TestLogger._silent = false;
    return TestLogger;
}());
exports.default = TestLogger;
