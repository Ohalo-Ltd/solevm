pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMMemory} from "../src/EVMMemory.slb";
import {MemOps} from "./MemOps.slb";

contract EVMMemoryTest {
    using EVMMemory for EVMMemory.Memory;

    uint constant internal ALLOC_SIZE = 64;
    uint constant internal WORD_SIZE = 32;

    uint constant internal testVal1 = 55;
    uint constant internal testVal2 = 3246;
    uint constant internal testVal3 = 2;

    function testCreate() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();

        assert(mem.size == 0);
        assert(mem.cap == ALLOC_SIZE);

        uint fMem = MemOps.freeMemPtr();
        assert(mem.dataPtr + mem.cap*WORD_SIZE == fMem);

        for(uint i = 0; i < ALLOC_SIZE; i++) {
            uint pos = mem.dataPtr + i*WORD_SIZE;
            uint atMem;
            assembly {
                atMem := mload(pos)
            }
            assert(atMem == 0);
        }
    }

    function testSetCapacity() public payable returns (bool ret) {
        ret = true;
        uint CAP = 117;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.setCapacity(CAP);

        assert(mem.size == 0);
        assert(mem.cap == CAP);

        uint fMem = MemOps.freeMemPtr();
        assert(mem.dataPtr + mem.cap*WORD_SIZE == fMem);

        for(uint i = 0; i < CAP; i++) {
            uint pos = mem.dataPtr + i*WORD_SIZE;
            uint atMem;
            assembly {
                atMem := mload(pos)
            }
            assert(atMem == 0);
        }
    }

    function testStore8() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.store8(4, 3);
        uint pos = mem.dataPtr + 4;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x0300000000000000000000000000000000000000000000000000000000000000);
        assert(mem.size == 1);
    }

    function testStore8Expand() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        uint sAddr = WORD_SIZE*70;
        mem.store8(sAddr, 3);
        assert(mem.cap == sAddr / WORD_SIZE + 1 + ALLOC_SIZE);
        uint pos = mem.dataPtr + sAddr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x0300000000000000000000000000000000000000000000000000000000000000);
        assert(mem.size == 71);
    }

    function testStore() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.store(4, 3);
        uint pos = mem.dataPtr + 4;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x03);
        assert(mem.size == 2);
    }

    function testStoreExpand() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        uint sAddr = WORD_SIZE*83;
        mem.store(sAddr, 3);
        assert(mem.cap == (sAddr + 31) / 32 + 1 + ALLOC_SIZE);
        uint pos = mem.dataPtr + sAddr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x03);
        assert(mem.size == 84);
    }

    function testStoreBytes1() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = hex"01020304";
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 0, 0, bts.length);
        uint pos = mem.dataPtr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val >> 8*(32 - bts.length) == 0x01020304);
        assert(mem.size == 1);
    }

    function testStoreBytes2() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = hex"01020304050607080102030405060708010203040506070801020304050607080102030405060708";
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 0, 0, bts.length);
        uint pos = mem.dataPtr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x0102030405060708010203040506070801020304050607080102030405060708);
        pos += 0x20;
        assembly {
            val := mload(pos)
        }
        assert(val >> 8*(32 - bts.length % 32) == 0x0102030405060708);
        assert(mem.size == 2);
    }

    function testStoreBytes3() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = hex"01020304";
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 0, 0, 3);
        uint pos = mem.dataPtr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val >> 8*(32 - 3) == 0x010203);
        assert(mem.size == 1);
    }

    function testStoreBytes4() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = hex"01020304";
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 1, 1, 3);
        uint pos = mem.dataPtr + 1;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val >> 8*(32 - 3) == 0x020304);
        assert(mem.size == 1);
    }

    function testStoreBytes5() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = hex"01020304050607080102030405060708010203040506070801020304050607080102030405060708";
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 5, 112*WORD_SIZE, 33);
        uint pos = mem.dataPtr + 112*WORD_SIZE;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(val == 0x0607080102030405060708010203040506070801020304050607080102030405);
        pos += 0x20;
        assembly {
            val := mload(pos)
        }
        assert(val >> 248 == 0x06);
        assert(mem.size == 114); // start is 112 + two words for data.
    }

    function testLoad() public payable returns (bool ret) {
        ret = true;
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        uint sAddr = 7;
        mem.store(sAddr, 3);
        assert(mem.load(sAddr) == 3);
    }

    function testStoreBytesBigArray() public payable returns (bool ret) {
        ret = true;
        bytes memory bts = new bytes(500000*32);
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(bts, 0, 0, bts.length);
        uint pos = mem.dataPtr;
        uint val;
        assembly {
            val := mload(pos)
        }
        assert(mem.size == 500000);
        assert(mem.cap == 500064);
    }

}