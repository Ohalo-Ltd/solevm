import child = require('child_process');
import {CHAIN_FILE} from "./constants";
const execSync = child.execSync;

export const run = (file, input) => {
    const cmd = `evm --prestate ${CHAIN_FILE} --codefile ${file} --input ${input} --gas 1000000000000 run`;
    const ret = execSync(cmd);
    //console.log(ret.toString());
    if (ret === null) {
        throw new Error(`Failed when running command: ${cmd}`);
    }
    if (ret === null) {
        throw new Error(`Failed when running command: ${cmd}`);
    }
    const retStr = ret.toString();
    if (retStr.length === 0) {
        throw new Error(`Failed when running command: ${cmd}`);
    }
    const res = retStr.substring(0, retStr.indexOf('\n')).trim();
    return res === '0x' ? '0' : res.substr(2);
};

export const version = () => {
    return execSync('evm --version').toString().trim();
};