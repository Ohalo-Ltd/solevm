pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

import {EVMAccounts} from "./EVMAccounts.slb";
import {EVMStorage} from "./EVMStorage.slb";

contract EVMAccountsTest {
    using EVMAccounts for EVMAccounts.Accounts;
    using EVMStorage for EVMStorage.Storage;

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

    function testCopy() public payable returns (bool ret) {
        ret = true;
        EVMAccounts.Accounts memory accs;
        EVMAccounts.Account memory acc = accs.get(0x01);
        acc.balance = 5;
        acc.nonce = 6;
        acc.code = new bytes(2);
        acc.stge.store(0x01, 0x02);
        acc.stge.store(0x03, 0x04);

        EVMAccounts.Account memory acc2 = accs.get(0x02);
        acc2.balance = 7;
        acc2.nonce = 8;
        acc2.code = new bytes(3);
        acc2.stge.store(0x05, 0x06);
        acc2.stge.store(0x07, 0x08);
        acc2.destroyed = true;

        EVMAccounts.Accounts memory cpy = EVMAccounts.copy(accs);
        EVMAccounts.Account memory cAcc = accs.get(0x01);
        EVMAccounts.Account memory cAcc2 = accs.get(0x02);

        assert(cpy.size == 2);

        assert(cAcc.addr == 0x01);
        assert(cAcc.balance == 5);
        assert(cAcc.nonce == 6);
        assert(cAcc.code.length == 2);
        assert(cAcc.stge.load(0x01) == 0x02);
        assert(cAcc.stge.load(0x03) == 0x04);
        assert(!cAcc.destroyed);

        assert(cAcc2.addr == 0x02);
        assert(cAcc2.balance == 7);
        assert(cAcc2.nonce == 8);
        assert(cAcc2.code.length == 3);
        assert(cAcc2.stge.load(0x05) == 0x06);
        assert(cAcc2.stge.load(0x07) == 0x08);
        assert(cAcc2.destroyed);

    }

}
