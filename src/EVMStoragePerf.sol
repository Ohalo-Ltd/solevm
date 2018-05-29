pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMStorage} from "./EVMStorage.slb";

contract EVMStoragePerf {

    using EVMStorage for EVMStorage.Storage;

    uint constant internal WORD_SIZE = 32;

    function perfStorageStoreFirst() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        gas = gasleft();
        stge.store(1, 1);
        gas -= gasleft();
    }

    function perfStorageStoreSecond() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        gas = gasleft();
        stge.store(2, 1);
        gas -= gasleft();
    }

    function perfStorageStoreTenth() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        for (uint i = 1; i < 10; i++) {
            stge.store(i, 1);
        }
        gas = gasleft();
        stge.store(10, 1);
        gas -= gasleft();
    }

    function perfStorageLoadFirst() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        gas = gasleft();
        stge.load(1);
        gas -= gasleft();
    }

    function perfStorageLoadSecond() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        stge.store(2, 1);
        gas = gasleft();
        stge.load(2);
        gas -= gasleft();
    }

    function perfStorageLoadTenth() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        for (uint i = 1; i <= 10; i++) {
            stge.store(i, 1);
        }
        gas = gasleft();
        stge.load(10);
        gas -= gasleft();
    }

    function perfStorageCopyOne() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        gas = gasleft();
        stge.copy();
        gas -= gasleft();
    }

    function perfStorageCopyTwo() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        stge.store(2, 1);
        gas = gasleft();
        stge.copy();
        gas -= gasleft();
    }

    function perfStorageCopyTen() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        for (uint i = 1; i <= 10; i++) {
            stge.store(i, 1);
        }
        gas = gasleft();
        stge.copy();
        gas -= gasleft();
    }

    function perfStorageToArrayZero() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        gas = gasleft();
        stge.toArray();
        gas -= gasleft();
    }

    function perfStorageToArrayOne() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        gas = gasleft();
        stge.toArray();
        gas -= gasleft();
    }

    function perfStorageToArrayTwo() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        stge.store(1, 1);
        stge.store(2, 1);
        gas = gasleft();
        stge.toArray();
        gas -= gasleft();
    }

    function perfStorageToArrayTen() public payable returns (uint gas) {
        EVMStorage.Storage memory stge;
        for (uint i = 1; i <= 10; i++) {
            stge.store(i, 1);
        }
        gas = gasleft();
        stge.toArray();
        gas -= gasleft();
    }

}
