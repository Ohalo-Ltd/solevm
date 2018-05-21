pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMStorage} from "./EVMStorage.slb";

contract EVMStorageTest {
    using EVMStorage for EVMStorage.Storage;
    using EVMStorage for EVMStorage.Element;

    function testStoreEmpty() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        assert(sge.size == 1);
        assert(sge.head._next == 0);
        assert(sge.head.slot.addr == 0x01);
        assert(sge.head.slot.val == 0x02);
    }

    function testStoreTwo() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        sge.store(0x03, 0x04);
        assert(sge.size == 2);

        EVMStorage.Element memory e = sge.head;
        assert(e._next != 0);
        assert(e.slot.addr == 0x01);
        assert(e.slot.val == 0x02);

        uint n = e._next;
        assembly {
            e := n
        }
        assert(e._next == 0);

        assert(e.slot.addr == 0x03);
        assert(e.slot.val == 0x04);

    }

    function testOverwrite() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        sge.store(0x01, 0x03);
        assert(sge.size == 1);
        assert(sge.head._next == 0);
        assert(sge.head.slot.addr == 0x01);
        assert(sge.head.slot.val == 0x03);
    }

    function testLoad() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        sge.store(0x03, 0x04);

        assert(sge.load(0x01) == 0x02);
        assert(sge.load(0x03) == 0x04);
        assert(sge.load(0x1234) == 0);
    }

    function testCopy() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        sge.store(0x03, 0x04);
        sge.store(0x05, 0x06);

        EVMStorage.Storage memory cpy = sge.copy();

        assert(cpy.size == 3);
        assert(cpy.load(0x01) == 0x02);
        assert(cpy.load(0x03) == 0x04);
        assert(cpy.load(0x05) == 0x06);
    }

    function testToArray() public payable returns (bool ret) {
        ret = true;
        EVMStorage.Storage memory sge;
        sge.store(0x01, 0x02);
        sge.store(0x03, 0x00);
        sge.store(0x05, 0x06);

        EVMStorage.StorageSlot[] memory sgeArr = sge.toArray();
        assert(sgeArr.length == 3);
        assert(sgeArr[0].addr == 0x01);
        assert(sgeArr[0].val == 0x02);
        assert(sgeArr[1].addr == 0x03);
        assert(sgeArr[1].val == 0x00);
        assert(sgeArr[2].addr == 0x05);
        assert(sgeArr[2].val == 0x06);
    }

}
