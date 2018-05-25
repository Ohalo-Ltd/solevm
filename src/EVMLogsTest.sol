pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMLogs} from "./EVMLogs.slb";

contract EVMLogsTest {
    using EVMLogs for EVMLogs.Logs;

    function _btsEqual(bytes memory a, bytes memory b, uint aIdx, uint bIdx, uint len) internal pure returns (bool eq) {
        assert(aIdx + len <= a.length);
        assert(bIdx + len <= b.length);
        eq = true;
        for (uint i = 0; i < len; i++) {
            if(a[aIdx + i] != b[bIdx + i]) {
                eq = false;
                return;
            }
        }
    }

    function testAddEmpty() public payable returns (bool ret) {
        ret = true;
        EVMLogs.Logs memory logs;

        EVMLogs.LogEntry memory log;
        log.account = 0x1;
        log.topics = [uint(1), 2, 3, 4];
        log.data = new bytes(5);
        logs.add(log);

        assert(logs.size == 1);
        assert(logs.tail._prev == 0);
        assert(logs.tail.entry.account == 0x1);
        assert(logs.tail.entry.topics[0] == 1);
        assert(logs.tail.entry.topics[1] == 2);
        assert(logs.tail.entry.topics[2] == 3);
        assert(logs.tail.entry.topics[3] == 4);
        assert(logs.tail.entry.data.length == 5);
    }

    function testAddTwo() public payable returns (bool ret) {
        ret = true;
        EVMLogs.Logs memory logs;

        EVMLogs.LogEntry memory log;
        log.account = 0x1;
        logs.add(log);

        EVMLogs.LogEntry memory log2;
        log2.account = 0x2;
        logs.add(log2);

        uint prev = logs.tail._prev;

        assert(logs.size == 2);
        assert(logs.tail._prev != 0);
        assert(logs.tail.entry.account == 0x2);

        EVMLogs.Element memory e;
        assembly {
            e := prev
        }
        assert(e._prev == 0);
        assert(e.entry.account == 0x1);
    }

    function testAddCopy() public payable returns (bool ret) {
        ret = true;
        EVMLogs.Logs memory logs;

        EVMLogs.LogEntry memory log;
        log.account = 0x1;
        logs.add(log);

        EVMLogs.LogEntry memory log2;
        log2.account = 0x2;
        logs.add(log2);

        EVMLogs.Logs memory logsCopy = logs.copy();

        uint prev = logsCopy.tail._prev;

        assert(logsCopy.size == 2);
        assert(logsCopy.tail._prev != 0);
        assert(logsCopy.tail.entry.account == 0x2);

        EVMLogs.Element memory e;
        assembly {
            e := prev
        }
        assert(e._prev == 0);
        assert(e.entry.account == 0x1);
    }

    function testToArray() public payable returns (bool ret) {
        ret = true;
        EVMLogs.Logs memory logs;

        EVMLogs.LogEntry memory log;
        log.account = 0x1;
        log.topics[0] = 7;
        log.topics[1] = 4;
        log.topics[2] = 1;
        log.topics[3] = 3;
        log.data = hex"0102030405";
        logs.add(log);

        EVMLogs.LogEntry memory log2;
        log2.account = 0x2;
        log2.data = hex"1122334455667788";
        logs.add(log2);

        assert(logs.size == 2);

        uint[] memory logsArr;
        bytes memory data;
        (logsArr, data) = logs.toArray();
        assert(logsArr.length == 14);
        assert(data.length == 13);

        assert(logsArr[0] == 0x1);
        assert(logsArr[1] == 7);
        assert(logsArr[2] == 4);
        assert(logsArr[3] == 1);
        assert(logsArr[4] == 3);
        assert(logsArr[5] == 0);
        assert(logsArr[6] == 5);
        assert(logsArr[7] == 0x2);
        assert(logsArr[8] == 0);
        assert(logsArr[9] == 0);
        assert(logsArr[10] == 0);
        assert(logsArr[11] == 0);
        assert(logsArr[12] == 5);
        assert(logsArr[13] == 8);

        assert(_btsEqual(data, log.data, 0, 0, log.data.length));
        assert(_btsEqual(data, log2.data, 5, 0, log2.data.length));
    }

}
