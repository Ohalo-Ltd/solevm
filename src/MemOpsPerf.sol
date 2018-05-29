pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {MemOps} from "./MemOps.slb";

contract MemOpsPerf {

    uint constant internal WORD_SIZE = 32;

    function perfAllocateOneWord() public payable returns (uint gas) {
        uint NUM_BYTES = 64;
        gas = gasleft();
        MemOps.allocate(NUM_BYTES);
        gas -= gasleft();
    }

    function perfAllocateOneHundredWords() public payable returns (uint gas) {
        uint NUM_BYTES = 64*100;
        gas = gasleft();
        MemOps.allocate(NUM_BYTES);
        gas -= gasleft();
    }


    function perfAllocate32OneWord() public payable returns (uint gas) {
        uint NUM_BYTES = 64;
        gas = gasleft();
        MemOps.allocate32(NUM_BYTES);
        gas -= gasleft();
    }

    function perfAllocate32OneHundredWords() public payable returns (uint gas) {
        uint NUM_BYTES = 64*100;
        gas = gasleft();
        MemOps.allocate32(NUM_BYTES);
        gas -= gasleft();
    }

    function perfMemcopy_32Bytes() public payable returns (uint gas) {
        uint WORDS = 1;
        uint srcPtr = MemOps.allocate32(WORDS);
        uint destPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memcopy(srcPtr, destPtr, 32);
        gas -= gasleft();
    }

    function perfMemcopy_3200Bytes() public payable returns (uint gas) {
        uint WORDS = 100;
        uint srcPtr = MemOps.allocate32(WORDS);
        uint destPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memcopy(srcPtr, destPtr, 3200);
        gas -= gasleft();
    }

    function perfMemcopy32_32Bytes() public payable returns (uint gas) {
        uint WORDS = 1;
        uint srcPtr = MemOps.allocate32(WORDS);
        uint destPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memcopy32(srcPtr, destPtr, WORDS);
        gas -= gasleft();
    }

    function perfMemcopy32_3200Bytes() public payable returns (uint gas) {
        uint WORDS = 100;
        uint srcPtr = MemOps.allocate32(WORDS);
        uint destPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memcopy32(srcPtr, destPtr, WORDS);
        gas -= gasleft();
    }

    function perfMemclear_32Bytes() public payable returns (uint gas) {
        uint WORDS = 1;
        uint srcPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memclear(srcPtr, 32);
        gas -= gasleft();
    }

    function perfMemclear_3200Bytes() public payable returns (uint gas) {
        uint WORDS = 100;
        uint srcPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memclear(srcPtr, 3200);
        gas -= gasleft();
    }

    function perfMemclear32_32Bytes() public payable returns (uint gas) {
        uint WORDS = 1;
        uint srcPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memclear32(srcPtr, WORDS);
        gas -= gasleft();
    }

    function perfMemclear32_3200Bytes() public payable returns (uint gas) {
        uint WORDS = 100;
        uint srcPtr = MemOps.allocate32(WORDS);

        gas = gasleft();
        MemOps.memclear32(srcPtr, WORDS);
        gas -= gasleft();
    }

}
