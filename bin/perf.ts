#!/usr/bin/env node

import {getContractFile} from "../script/io";
import {runPerfs} from "../script/perf";

(async () => {
    try {
        const cf = getContractFile();
        const success = await runPerfs(cf["perfs"]);
        if (!success) {
            process.exit(1);
        }
    } catch (error) {
        console.log(error.message);
        process.exit(2);
    }
})();
