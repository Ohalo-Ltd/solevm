"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var io_1 = require("./io");
exports.readTestFile = function (filePath) {
    return io_1.readJSON(filePath);
};
exports.readVMTests = function (testDir) {
};
