import * as chalk from "chalk";
import {println} from "./io";

export default class TestLogger {

    static _silent = false;

    static header(text) {
        println(chalk["cyanBright"](text));
    }

    static info(text) {
        if (!TestLogger._silent) {
            println(chalk["blueBright"](text));
        }
    }

    static success(text) {
        if (!TestLogger._silent) {
            println(chalk["greenBright"](text));
        }
    }

    static moderate(text) {
        if (!TestLogger._silent) {
            println(chalk["yellowBright"](text));
        }
    }

    static fail(text) {
        println(chalk["redBright"](text));
    }

    static testResult(fName, success) {
        if (!TestLogger._silent) {
            const color = success ? "greenBright" : "redBright";
            const result = success ? "PASSED" : "FAILED";
            println(`${chalk["white"](fName)}: ${chalk[color](result)}`);
        }
    }

    static perfResult(fName, gas) {
        if (!TestLogger._silent) {
            println(`${chalk["white"](fName)}: ${chalk["greenBright"](gas)}`);
        }
    }

    static setSilent(silent) {
        TestLogger._silent = silent;
    }

    static silent() {
        return TestLogger._silent;
    }

}