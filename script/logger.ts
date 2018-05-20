import * as chalk from 'chalk';
import {println} from "./io";

export const Level = {
    Error: 0,
    Warn: 1,
    Info: 2,
    Debug: 3
};

export default class Logger {

    static _level = Level.Info;

    static error(text) {
        println(chalk['redBright'](`[Error] ${text}`));
    }
    
    static warn(text) {
        if (Logger._level >= Level.Warn) {
            println(chalk['yellowBright'](`[Warning] ${text}`));
        }
    }

    static info(text) {
        if (Logger._level >= Level.Info) {
            println(chalk['whiteBright'](`[Info] ${text}`));
        }
    }

    static debug(text) {
        if (Logger._level === Level.Debug) {
            println(chalk['blueBright'](`[Debug] ${text}`));
        }
    }

    static setLevel(level) {
        Logger._level = level;
    }

    static level() {
        switch (Logger._level) {
            case Level.Error:
                return 'error';
            case Level.Warn:
                return 'warn';
            case Level.Info:
                return 'info';
            case Level.Debug:
                return 'debug';
        }
    }
}