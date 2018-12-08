import {readVMTests, runVMTest} from "../script/eth_tests";
import os = require('os');
import path = require('path');

(async () => {
    try {
        const tests = readVMTests(path.join(os.homedir(), "tests"));
        console.log(tests["vmArithmeticTest"][0]["add0"]);
        await runVMTest(tests["vmArithmeticTest"][0]["add0"]);
    } catch (error) {
        console.log(error.message);
        process.exit(2);
    }
})();
