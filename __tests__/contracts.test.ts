import {execute} from "../script/adapter";
import {
    BIN_OUTPUT_PATH,
    CONTRACT_TEST_SIG,
    ERROR_STATE_REVERTED,
    NO_ERROR,
    ROOT_PATH
} from "../script/constants";
import {compile} from "../script/solc";
import path = require("path");
import {readText} from "../script/io";

describe('solidity contracts', () => {

    it('should call test function on TestContractNoop', async () => {
        await compile(path.join(ROOT_PATH, '__tests__', 'testcontract_noop.sol'), BIN_OUTPUT_PATH, true);
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractNoop.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
    });

    it('should call test function on TestContractRetUint', async () => {
        await compile(path.join(ROOT_PATH, '__tests__', 'testcontract_retuint.sol'), BIN_OUTPUT_PATH, true);
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractRetUint.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000005');
    });

    it('should call test function on TestContractReverts', async () => {
        await compile(path.join(ROOT_PATH, '__tests__', 'testcontract_reverts.sol'), BIN_OUTPUT_PATH, true);
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractReverts.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        //console.log(result);
        expect(result.errno).toBe(ERROR_STATE_REVERTED);
        expect(result.returnData).toBe('');
    });

    it('should call test function on TestContractRevertsWithArgument', async () => {
        await compile(path.join(ROOT_PATH, '__tests__', 'testcontract_revertswitharg.sol'), BIN_OUTPUT_PATH, true);
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractRevertsWithArgument.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        //console.log(result);
        expect(result.errno).toBe(ERROR_STATE_REVERTED);
        //expect(result.returnData).toBe('');
    });

    it('should call test function on TestContractCallsItself', async () => {
        await compile(path.join(ROOT_PATH, '__tests__', 'testcontract_callsitself.sol'), BIN_OUTPUT_PATH, true);
        const code = readText(path.join(BIN_OUTPUT_PATH, 'TestContractCallsItself.bin-runtime'));
        const result = await execute(code, CONTRACT_TEST_SIG);
        //console.log(result);
        expect(result.errno).toBe(NO_ERROR);
        expect(result.returnData).toBe('0000000000000000000000000000000000000000000000000000000000000003');
    });

});
