pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMAccounts} from "./EVMAccounts.slb";

contract EVMAccountsTest {
    using EVMAccounts for EVMAccounts.Accounts;

    function testGetEmpty() public payable returns (bool ret) {
        ret = true;
        EVMAccounts.Accounts memory accs;
        EVMAccounts.Account memory acc = accs.get(0x01);
        assert(accs.size == 1);
        assert(acc.addr == 0x01);
    }

    function testGetTwoNew() public payable returns (bool ret) {
        ret = true;
        EVMAccounts.Accounts memory accs;
        EVMAccounts.Account memory acc = accs.get(0x01);
        EVMAccounts.Account memory acc2 = accs.get(0x02);
        assert(accs.size == 2);
        assert(acc.addr == 0x01);
        assert(acc2.addr == 0x02);
    }

    function testGetAlreadyExisting() public payable returns (bool ret) {
        ret = true;
        EVMAccounts.Accounts memory accs;
        accs.get(0x01);
        EVMAccounts.Account memory acc = accs.get(0x01);
        assert(accs.size == 1);
        assert(acc.addr == 0x01);
    }

}
