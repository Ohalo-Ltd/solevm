pragma solidity ^0.5.0;

import {EVMMemory} from "./EVMMemory.slb";

contract EVMMemoryPerf {

    using EVMMemory for EVMMemory.Memory;

    uint constant internal WORD_SIZE = 32;

    function perfMemoryCreateNew() public payable returns (uint gas) {
        gas = gasleft();
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas -= gasleft();
    }

    function perfMemoryStore8New() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.store8(1, 1);
        gas -= gasleft();
    }

    function perfMemoryStore8Force64WordsReallocSizeZero() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.cap = 0;
        gas = gasleft();
        mem.store8(0, 1);
        gas -= gasleft();
    }

    function perfMemoryStore8NoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.store8(1, 1);
        gas = gasleft();
        mem.store8(1, 1);
        gas -= gasleft();
    }

    function perfMemoryStoreNew() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.store8(1, 1);
        gas -= gasleft();
    }

    function perfMemoryStoreNoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.store(1, 1);
        gas = gasleft();
        mem.store(1, 1);
        gas -= gasleft();
    }

    function perfMemoryStore32BytesNew() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.storeBytes(new bytes(32), 0, 0, 32);
        gas -= gasleft();
    }

    function perfMemoryStore32BytesNoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(new bytes(32), 0, 0, 32);
        gas = gasleft();
        mem.storeBytes(new bytes(32), 0, 0, 32);
        gas -= gasleft();
    }

    function perfMemoryStore64BytesNew() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.storeBytes(new bytes(64), 0, 0, 64);
        gas -= gasleft();
    }

    function perfMemoryStore64BytesNoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(new bytes(64), 0, 0, 64);
        gas = gasleft();
        mem.storeBytes(new bytes(64), 0, 0, 64);
        gas -= gasleft();
    }

    function perfMemoryStore320BytesNew() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.storeBytes(new bytes(320), 0, 0, 320);
        gas -= gasleft();
    }

    function perfMemoryStore320BytesNoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytes(new bytes(320), 0, 0, 320);
        gas = gasleft();
        mem.storeBytes(new bytes(320), 0, 0, 320);
        gas -= gasleft();
    }

    function perfMemoryStore32BytesPaddedWith32New() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.storeBytesAndPadWithZeroes(new bytes(32), 0, 0, 64);
        gas -= gasleft();
    }

    function perfMemoryStore32BytesPaddedWith32NoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.storeBytesAndPadWithZeroes(new bytes(32), 0, 0, 64);
        gas = gasleft();
        mem.storeBytesAndPadWithZeroes(new bytes(32), 0, 0, 64);
        gas -= gasleft();
    }

    function perfMemoryLoadNew() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.load(1);
        gas -= gasleft();
    }

    function perfMemoryLoadNoSizeChange() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.store(1, 1);
        gas = gasleft();
        mem.load(1);
        gas -= gasleft();
    }

    function perfMemoryExpand64WordsReallocSizeZero() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.cap = 0;
        gas = gasleft();
        mem.setCapacity(64);
        gas -= gasleft();
    }

    function perfMemoryExpand64WordsReallocSizeOne() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.cap = 1;
        mem.size = 1;
        gas = gasleft();
        mem.setCapacity(65);
        gas -= gasleft();
    }

    function perfMemoryExpand64WordsReallocSize64() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.size = 64;
        gas = gasleft();
        mem.setCapacity(128);
        gas -= gasleft();
    }

    function perfMemoryToArraySize0() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        gas = gasleft();
        mem.toArray();
        gas -= gasleft();
    }

    function perfMemoryToArraySize32() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.size = 32;
        gas = gasleft();
        mem.toArray();
        gas -= gasleft();
    }

    function perfMemoryToArraySize320() public payable returns (uint gas) {
        EVMMemory.Memory memory mem = EVMMemory.newMemory();
        mem.size = 320;
        mem.cap = 320;
        gas = gasleft();
        mem.toArray();
        gas -= gasleft();
    }

}
