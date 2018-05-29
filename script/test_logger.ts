import * as chalk from "chalk";
import {println} from "./io";

export default class TestLogger {

    private static _silent = false;

    public static header(text: string) {
        println(chalk["cyanBright"](text));
    }

    public static info(text: string) {
        if (!TestLogger._silent) {
            println(chalk["blueBright"](text));
        }
    }

    public static success(text: string) {
        if (!TestLogger._silent) {
            println(chalk["greenBright"](text));
        }
    }

    public static moderate(text: string) {
        if (!TestLogger._silent) {
            println(chalk["yellowBright"](text));
        }
    }

    public static fail(text: string) {
        println(chalk["redBright"](text));
    }

    public static testResult(fName: string, success: boolean) {
        if (!TestLogger._silent) {
            const color = success ? "greenBright" : "redBright";
            const result = success ? "PASSED" : "FAILED";
            println(`${chalk["white"](fName)}: ${chalk[color](result)}`);
        }
    }

    public static perfResult(fName: string, gas: boolean) {
        if (!TestLogger._silent) {
            println(`${chalk["white"](fName)}: ${chalk["greenBright"](gas)}`);
        }
    }

    public static setSilent(silent: boolean) {
        TestLogger._silent = silent;
    }

    public static silent(): boolean {
        return TestLogger._silent;
    }

}
