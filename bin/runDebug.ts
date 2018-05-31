#!/usr/bin/env node

import {executeWithPreImage, newDefaultPreImage, prettyPrintResults} from "../script/adapter";
import {BigNumber} from "bignumber.js";

(async () => {
    try {
        const preImg = newDefaultPreImage('6001600201', '', new BigNumber(5));
        const stack = [] as [BigNumber];
        stack.push(new BigNumber(1));
        stack.push(new BigNumber(2));
        preImg.stack = stack;
        preImg.pc = 4;
        const result = await executeWithPreImage(preImg);
        prettyPrintResults(result);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
