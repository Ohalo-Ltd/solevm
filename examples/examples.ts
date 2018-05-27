#!/usr/bin/env node

import {compile} from "../script/solc";
import {createTxInput, execute, executeWithTxInput, prettyPrintResults} from "../script/adapter";
import {ADD, BIN_OUTPUT_PATH, CALLVALUE, PUSH1, SOL_ETH_SRC} from "../script/constants";

const addExample = async () => {
    // Push the numbers 3 and 5, and add them.
    const code = PUSH1 + '03' + PUSH1 + '05' + ADD;
    const data = '';
    // Get the result by executing the code with the given data.
    // This should result in one stack element containing the number
    // '08', as well as the creation of two accounts - caller and
    // contract. The addresses the default caller and contract accounts.
    try {
        const result = await execute(code, data);
        prettyPrintResults(result);
    } catch (err) {
        console.log(err);
    }
};

const callValueExample = async () => {
    // invoke the CALLVALUE instruction.
    const code = CALLVALUE;
    const data = '';
    // Get the result by executing the code with the given data, which
    // is now the extended TxInput object.
    // This should result in one stack element containing the number
    // '03', as well as the creation of the two default accounts.
    // Additionally, 3 wei should be transferred successfully to
    // the contract account.
    try {
        const input = createTxInput(code, data, 3);
        const result = await executeWithTxInput(input);
        prettyPrintResults(result);
    } catch (err) {
        console.log(err);
    }
};

const callValueFailsExample = async () => {
    // invoke the CALLVALUE instruction.
    const code = CALLVALUE;
    const data = '';
    // Get the result by executing the code with the given data, which
    // is now the extended TxInput object.
    // This should result in a failure (errno = 11 = ERROR_INVALID_WRITE_OPERATION)
    // since the transaction has a non-zero value but is set to be a static call.
    try {
        const input = createTxInput(code, data, 3);
        input.staticExec = true;
        const result = await executeWithTxInput(input);
        prettyPrintResults(result);
    } catch (err) {
        console.log(err);
    }
};

(async () => {
    console.log("Compiling runtime contract");
    await compile(SOL_ETH_SRC, BIN_OUTPUT_PATH, true);
    console.log("Done. Executing code");
    console.log("ADD example");
    await addExample();
    console.log("CALLVALUE example");
    await callValueExample();
    console.log("CALLVALUE fail example");
    await callValueFailsExample();
})();