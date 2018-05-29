import path = require('path');
import {BIN_OUTPUT_PATH} from "./constants";
import {ensureAndClear, parseSigFile} from "./io";
import {run} from "./evm";
import TestLogger from "./test_logger";
import {compileContracts} from "./solc";

export const runPerfs = async (perfs: [string]): Promise<void> => {
    ensureAndClear(BIN_OUTPUT_PATH);
    await compileAndRunPerfs(perfs, true);
    return;
};

export const compileAndRunPerfs = async (units: [string], optimize: boolean): Promise<void> => {
    await compileContracts(units, optimize);
    const results = [];
    TestLogger.header("\n");
    TestLogger.header(`Running perf`);
    TestLogger.header("\n");
    for (const unit of units) {
        results.push(runPerf(unit));
    }
    TestLogger.header("Done");
    return;
};

export const runPerf = (unit: string): void => {
    const funcs = parseSigFile(unit);
    const binPath = path.join(BIN_OUTPUT_PATH, unit + ".bin-runtime");
    let tests = 0;
    let failed = 0;

    TestLogger.info(`${unit}`);
    for (const func in funcs) {
        if (funcs.hasOwnProperty(func)) {
            const fName = funcs[func].trim();
            if (fName.length < 4 || fName.substr(0, 4) !== "perf") {
                continue;
            }
            const result = parseData(run(binPath, func));
            TestLogger.perfResult(fName, result);
        }
    }
    TestLogger.info("");
};

const parseData = (output: string): number => parseInt(output, 16);
