"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var constants_1 = require("./constants");
exports.print = function (text) {
    process.stdout.write(text);
};
exports.println = function (text) {
    process.stdout.write(text + '\n');
};
exports.readText = function (filePath) {
    return fs.readFileSync(filePath).toString();
};
exports.readJSON = function (filePath) {
    return JSON.parse(exports.readText(filePath));
};
exports.rmrf = function (pth) {
    if (fs.existsSync(pth)) {
        fs.readdirSync(pth).forEach(function (file) {
            var curPath = pth + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                exports.rmrf(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(pth);
    }
};
exports.ensureAndClear = function (dir) {
    exports.rmrf(dir);
    mkdirp.sync(dir);
};
exports.getContractFile = function () {
    return exports.readJSON(constants_1.CONTRACT_FILE);
};
exports.parseSigFile = function (testName) {
    var hashes = fs.readFileSync(path.join(constants_1.BIN_OUTPUT_PATH, testName + ".signatures")).toString();
    var lines = hashes.split(/\r\n|\r|\n/);
    var funcs = {};
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        line = line.trim();
        if (line.length === 0) {
            continue;
        }
        var tokens = line.split(':');
        if (tokens.length !== 2) { // Should never happen with well formed signature files.
            throw new Error("No ':' separator in line: '" + line + "' in signatures: " + testName);
        }
        var hash = tokens[0].trim();
        funcs[hash] = tokens[1].trim();
    }
    return funcs;
};
exports.filesInFolder = function (folderPath, extension) {
    var stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) {
        throw new Error("Not a directory: " + folderPath);
    }
    var files = [];
    fs.readdirSync(folderPath).forEach(function (file) {
        var fPath = path.join(folderPath, file);
        var stat = fs.statSync(fPath);
        if (!stat.isDirectory()) {
            if (extension != "" && path.extname(file) == extension) {
                files.push(fPath);
            }
        }
    });
    return files;
};
