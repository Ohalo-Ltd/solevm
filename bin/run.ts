#!/usr/bin/env node

import {execute, prettyPrintResults} from "../script/adapter";

(async () => {
    try {
        const result = await execute(process.argv[2] || '', process.argv[3] || '');
        prettyPrintResults(result);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
