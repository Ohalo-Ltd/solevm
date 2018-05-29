import path = require('path');
import {BIN_OUTPUT_PATH} from "./constants";
import {ensureAndClear, parseSigFile} from "./io";
import {compileTests} from "./solc";
import {run} from "./evm";
import TestLogger from "./test_logger";
import {hasOwnProperty} from "tslint/lib/utils";

export interface ITestData {
    name: string;
    tests: number;
    failed: number;
}

export const runTests = async (tests: [string]): Promise<boolean> => {
    ensureAndClear(BIN_OUTPUT_PATH);
    return await compileAndRunTests(tests, true);
};

export const compileAndRunTests = async (units: [string], optimize: boolean): Promise<boolean> => {
    await compileTests(units, optimize);
    const results = [];
    TestLogger.header("\n");
    TestLogger.header(`Running tests`);
    TestLogger.header("\n");
    for (const unit of units) {
        results.push(runTest(unit));
    }
    TestLogger.header("Done");
    let tests = 0;
    let failed = 0;
    for (const result of results) {
        tests += result["tests"];
        failed += result["failed"];
    }
    TestLogger.info(`${tests} tests run:`);
    if (failed === 0) {
        TestLogger.success("All tests PASSED");
    } else {
        TestLogger.fail(`${failed} tests FAILED`);
    }
    return failed === 0;
};

export const runTest = (unit: string): ITestData => {
    const funcs = parseSigFile(unit);
    const binPath = path.join(BIN_OUTPUT_PATH, unit + ".bin-runtime");
    let tests = 0;
    let failed = 0;

    TestLogger.info(`${unit}`);
    for (const func in funcs) {
        if (funcs.hasOwnProperty(func)) {
            const fName = funcs[func].trim();
            if (fName.length < 4 || fName.substr(0, 4) !== "test") {
                continue;
            }
            const result = parseData(run(binPath, func));
            const throws = /Throws/.test(fName);
            let passed = true;
            tests++;
            if (throws && result) {
                failed++;
                passed = false;
            } else if (!throws && !result) {
                failed++;
                passed = false;
            }
            TestLogger.testResult(fName, passed);
        }
    }
    TestLogger.info("");
    return {
        name: unit,
        tests,
        failed
    };
};

const parseData = (output: string): boolean => parseInt(output, 16) === 1;
