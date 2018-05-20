#!/usr/bin/env node
import {runTests} from "../script/test";
import {getContractFile} from "../script/io";

(async () => {
    try {
        const cf = getContractFile();
        const success = await runTests(cf["tests"]);
        if (!success) {
            process.exit(1);
        }
    } catch (error) {
        console.log(error.message);
        process.exit(2);
    }
})();