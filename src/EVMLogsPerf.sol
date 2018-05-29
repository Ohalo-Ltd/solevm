pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMLogs} from "./EVMLogs.slb";

contract EVMLogsPerf {

    using EVMLogs for EVMLogs.Logs;

    uint constant internal WORD_SIZE = 32;

    function perfLogGetFirst() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        gas = gasleft();
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas -= gasleft();
    }

    function perfLogGetSecond() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas = gasleft();
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas -= gasleft();
    }

    function perfLogGetTenth() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        for (uint i = 1; i < 10; i++) {
            logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        }
        gas = gasleft();
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas -= gasleft();
    }

    function perfLogCopyOne() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas = gasleft();
        logs.copy();
        gas -= gasleft();
    }

    function perfLogCopyTwo() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas = gasleft();
        logs.copy();
        gas -= gasleft();
    }

    function perfLogCopyTen() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        for (uint i = 1; i <= 10; i++) {
            logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        }
        gas = gasleft();
        logs.copy();
        gas -= gasleft();
    }

    function perfLogToArrayOne() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas = gasleft();
        logs.toArray();
        gas -= gasleft();
    }

    function perfLogToArrayTwo() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        gas = gasleft();
        logs.toArray();
        gas -= gasleft();
    }

    function perfLogToArrayTen() public payable returns (uint gas) {
        EVMLogs.Logs memory logs;
        for (uint i = 1; i <= 10; i++) {
            logs.add(EVMLogs.LogEntry(1, [uint(2), 3, 4, 5], new bytes(5)));
        }
        gas = gasleft();
        logs.toArray();
        gas -= gasleft();
    }

}
