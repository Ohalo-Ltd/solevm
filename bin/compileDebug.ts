#!/usr/bin/env node

import {compile} from "../script/solc";
import {BIN_OUTPUT_PATH, SOL_ETH_DEBUG_SRC} from "../script/constants";

(async () => {
    try {
        await compile(SOL_ETH_DEBUG_SRC, BIN_OUTPUT_PATH, true);
    } catch (error) {
        console.log(error.message);
        process.exit(error);
    }
})();
