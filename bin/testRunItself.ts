#!/usr/bin/env node
import {runTests} from "../script/test";
import {getContractFile} from "../script/io";
import {executeInItself} from "../script/adapter";
import {PUSH1} from "../script/constants";

(async () => {
    try {
        const code = PUSH1 + '00';
        const data = '';
        const res = await executeInItself(code, data);
        console.log(res);
    } catch (error) {
        console.log(error.message);
        process.exit(2);
    }
})();