pragma solidity ^0.5.0;

import {MemOps} from "./MemOps.slb";

contract MemOpsTest {

    uint constant internal WORD_SIZE = 32;

    function testFreeMemPtr() public payable returns (bool ret) {
        ret = true;
        uint fMemAsm;
        assembly {
            fMemAsm := mload(0x40)
        }
        assert(fMemAsm == MemOps.freeMemPtr());
    }

    function testAllocate() public payable returns (bool ret) {
        ret = true;
        uint NUM_BYTES = 217;
        uint fMem = MemOps.freeMemPtr();
        MemOps.allocate(NUM_BYTES);
        uint fMem2 = MemOps.freeMemPtr();
        assert(fMem2 == fMem + NUM_BYTES);
    }

    function testAllocate32() public payable returns (bool ret) {
        ret = true;
        uint NUM_WORDS = 55;
        uint fMem = MemOps.freeMemPtr();
        MemOps.allocate32(NUM_WORDS);
        uint fMem2 = MemOps.freeMemPtr();
        assert(fMem2 == fMem + NUM_WORDS*WORD_SIZE);
    }

    function testMemcopyNoTail() public payable returns (bool ret) {
        ret = true;
        uint WORDS = 20;
        uint srcPtr = MemOps.allocate32(WORDS);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = srcPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }

        uint destPtr = MemOps.allocate32(WORDS);
        MemOps.memcopy(srcPtr, destPtr, WORDS*WORD_SIZE);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = destPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == i + 1);
        }
    }

    function testMemcopyWithTail() public payable returns (bool ret) {
        ret = true;
        uint WORDS = 20;
        uint LENGTH = WORDS*WORD_SIZE + 23;

        uint srcPtr = MemOps.allocate(LENGTH);
        for (uint i = 0; i < WORDS; i++) {
            uint pos = srcPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }
        uint tailPtr = srcPtr + WORDS*WORD_SIZE;
        uint tailVal = 0x0101010101010101010101010101010101010101010101000000000000000000;
        assembly {
            mstore(tailPtr, tailVal)
        }

        uint destPtr = MemOps.allocate(LENGTH);
        MemOps.memcopy(srcPtr, destPtr, LENGTH);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = destPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == i + 1);
        }
        tailPtr = destPtr + WORDS*WORD_SIZE;
        uint tailVal2;
        assembly {
            tailVal2 := mload(tailPtr)
        }
        assert(tailVal2 == tailVal);
    }

    function testMemcopy32() public payable returns (bool ret) {
        ret = true;
        uint NUM_WORDS = 20;
        uint srcPtr = MemOps.allocate32(NUM_WORDS);

        for (uint i = 0; i < NUM_WORDS; i++) {
            uint pos = srcPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }

        uint destPtr = MemOps.allocate(NUM_WORDS);
        MemOps.memcopy32(srcPtr, destPtr, NUM_WORDS);

        for (uint i = 0; i < NUM_WORDS; i++) {
            uint pos = srcPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == i + 1);
        }
    }

    function testMemclearNoTail() public payable returns (bool ret) {
        ret = true;
        uint WORDS = 20;
        uint startPtr = MemOps.allocate32(WORDS);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }

        MemOps.memclear(startPtr, WORDS*WORD_SIZE);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == 0);
        }
    }

    function testMemclearWithTail() public payable returns (bool ret) {
        ret = true;
        uint WORDS = 20;
        uint LENGTH = WORDS*WORD_SIZE + 23;
        uint startPtr = MemOps.allocate(LENGTH);
        for (uint i = 0; i < WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }
        uint tailPtr = startPtr + WORDS*WORD_SIZE;
        uint tailVal = 0x0101010101010101010101010101010101010101010101000000000000000000;
        assembly {
            mstore(tailPtr, tailVal)
        }

        MemOps.memclear(startPtr, LENGTH);

        for (uint i = 0; i < WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == 0);
        }
        tailPtr = startPtr + WORDS*WORD_SIZE;
        uint tailVal2;
        assembly {
            tailVal2 := mload(tailPtr)
        }
        assert(tailVal2 == 0);
    }

    function testMemclear32() public payable returns (bool ret) {
        ret = true;
        uint NUM_WORDS = 20;

        uint startPtr = MemOps.allocate32(NUM_WORDS);

        for (uint i = 0; i < NUM_WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            assembly {
                mstore(pos, add(i, 1))
            }
        }

        MemOps.memclear32(startPtr, NUM_WORDS);

        for (uint i = 0; i < NUM_WORDS; i++) {
            uint pos = startPtr + i*WORD_SIZE;
            uint val = 0;
            assembly {
                val := mload(pos)
            }
            assert(val == 0);
        }
    }

}
