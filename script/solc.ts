import path = require('path');
import child = require('child_process');
import {
    BIN_OUTPUT_PATH, ROOT_PATH, SRC_PATH
} from "./constants";

const exec = child.exec;

export const compileTests = async (tests: [string], optimize: boolean) => {
    for (const test of tests) {
        await compileTest(test, optimize);
    }
};

export const compileTest = async (test: string, optimize: boolean) => {
    console.log(`Compiling test: ${test}`);
    const filePath = path.join(SRC_PATH, test + ".sol");
    await compile(filePath, BIN_OUTPUT_PATH, optimize);
    console.log(`Done`);
};

export const compile = async (filePath: string, outDir: string, optimize: boolean): Promise<any> => {
    return new Promise((resolve, reject) => {
        const cmd = `solc .= --evm-version constantinople --bin --bin-runtime --abi --hashes --overwrite ${optimize ? "--optimize" : ""} -o ${outDir} ${filePath}`;
        exec(cmd, {cwd: ROOT_PATH}, (err, stdout, stderr) => {
            const ret = stderr.toString();
            // console.log(ret);
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
