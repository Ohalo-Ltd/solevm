pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMConstants} from "./EVMConstants.sol";
import {EthereumRuntime} from "./EthereumRuntime.sol";
import {EVMMemory} from "./EVMMemory.slb";
import {EVMStack} from "./EVMStack.slb";

contract EthereumRuntimeRuntime is EVMConstants {

    function execute(bytes memory code, bytes memory data) public returns (EthereumRuntime.Result memory res) {
        EthereumRuntime er = new EthereumRuntime();
        uint codeSize;
        address erAddr = address(er);
        assembly {
            codeSize := extcodesize(erAddr)
        }
        bytes memory erCode = new bytes(codeSize);
        assembly {
            extcodecopy(erAddr, add(erCode, 0x20), 0, codeSize)
        }
        bytes memory callData = abi.encodeWithSelector(0x1f6a1eb9, code, data);
        res = er.execute(erCode, callData);
        return res;
    }

}