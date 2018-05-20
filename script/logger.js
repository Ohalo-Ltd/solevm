"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require("chalk");
var io_1 = require("./io");
exports.Level = {
    Error: 0,
    Warn: 1,
    Info: 2,
    Debug: 3
};
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.error = function (text) {
        io_1.println(chalk['redBright']("[Error] " + text));
    };
    Logger.warn = function (text) {
        if (Logger._level >= exports.Level.Warn) {
            io_1.println(chalk['yellowBright']("[Warning] " + text));
        }
    };
    Logger.info = function (text) {
        if (Logger._level >= exports.Level.Info) {
            io_1.println(chalk['whiteBright']("[Info] " + text));
        }
    };
    Logger.debug = function (text) {
        if (Logger._level === exports.Level.Debug) {
            io_1.println(chalk['blueBright']("[Debug] " + text));
        }
    };
    Logger.setLevel = function (level) {
        Logger._level = level;
    };
    Logger.level = function () {
        switch (Logger._level) {
            case exports.Level.Error:
                return 'error';
            case exports.Level.Warn:
                return 'warn';
            case exports.Level.Info:
                return 'info';
            case exports.Level.Debug:
                return 'debug';
        }
    };
    Logger._level = exports.Level.Info;
    return Logger;
}());
exports.default = Logger;
