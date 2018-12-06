"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var constants_1 = require("./constants");
var execSync = child.execSync;
exports.run = function (file, input) {
    var cmd = "evm --prestate " + constants_1.CHAIN_FILE + " --codefile " + file + " --input " + input + " --gas 1000000000000 run";
    var ret = execSync(cmd);
    // console.log(ret.toString());
    if (ret === null) {
        throw new Error("Failed when running command: " + cmd);
    }
    var retStr = ret.toString();
    if (retStr.length === 0) {
        throw new Error("Failed when running command: " + cmd);
    }
    var res = retStr.substring(0, retStr.indexOf('\n')).trim();
    return res === '0x' ? '0' : res.substr(2);
};
exports.version = function () {
    return execSync('evm --version').toString().trim();
};
