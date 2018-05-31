import {filesInFolder, readJSON} from "./io";
import path = require('path');
import {executeWithTxInput, newDefaultTxInput, prettyPrintResults} from "./adapter";
import {BigNumber} from "bignumber.js";

export const readVMTests = (testDir: string) => {
    const tests = {};
    const vmTestDir = path.join(testDir, "VMTests");

    const arithFiles = filesInFolder(path.join(vmTestDir, 'vmArithmeticTest'), '.json');
    const arithObjs = [];
    for (const af of arithFiles) {
        arithObjs.push(readJSON(af));
    }
    tests["vmArithmeticTest"] = arithObjs;

    const bLogFiles = filesInFolder(path.join(vmTestDir, 'vmBitwiseLogicOperation'), '.json');
    const bLogObjs = [];
    for (const bf of bLogFiles) {
        bLogObjs.push(readJSON(bf));
    }
    tests["vmBitwiseLogicOperation"] = arithObjs;

    return tests;
};

export const runVMTest = async (testObj) => {
    const txInput = newDefaultTxInput();
    const exec = testObj.exec;
    if (!exec.caller || exec.caller.length < 2) {
        throw new Error("No caller address");
    }
    txInput.caller = exec.caller.substr(2);

    if (!exec.address || exec.address.length < 2) {
        throw new Error("No target address");
    }
    txInput.target = exec.address.substr(2);

    if (exec.value && exec.value.length >= 2) {
        txInput.value = new BigNumber(exec.value.substr(2), 16);
        txInput.callerBalance = txInput.value;
    }

    if (exec.code && exec.code.length > 2) {
        txInput.targetCode = exec.code.substr(2);
    } else {
        txInput.targetCode = '';
    }

    if (exec.data && exec.data.length > 2) {
        txInput.data = exec.data.substr(2);
    } else {
        txInput.data = '';
    }

    const result = await executeWithTxInput(txInput);
    prettyPrintResults(result);
};