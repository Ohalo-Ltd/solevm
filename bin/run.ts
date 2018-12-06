#!/usr/bin/env node

import {execute, executeWithPreImage, newDefaultPreImage, prettyPrintResults} from "../script/adapter";
import {BigNumber} from "bignumber.js";

(async () => {
    try {
        const result = await execute(process.argv[2] || '', process.argv[3] || '');
        prettyPrintResults(result);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
