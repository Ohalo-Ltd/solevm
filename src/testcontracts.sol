pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;


contract TestContractNoop {
    function test() public pure {}
}


contract TestContractRetUint {
    function test() public pure returns (uint) {
        return 5;
    }
}


contract TestContractReverts {
    function test() public pure {
        revert();
    }
}


contract TestContractRevertsWithArgument {
    function test() public pure {
        revert("abc");
    }
}


contract TestContractStorageAndInternal {

    struct S {
        uint v;
    }

    S private s;

    function _test(uint x) internal {
        s.v = x*x;
    }

    function test() public returns (uint) {
        _test(3);
        return s.v;
    }

}


contract TestContractStorageWrite {

    uint[] data;

    function test() public {
        data.length = 3;
        data[0] = 0x11;
        data[1] = 0x22;
        data[2] = 0x33;
    }

}


contract TestContractCallsItself {

    function test2() public returns (uint) {
        return 1;
    }

    function test() public returns (uint) {
        return this.test2() + 2;
    }

}


contract TestContractCallchainSameContract {

    function test4(uint x) public returns (uint) {
        return x + 1;
    }

    function test3(uint x) public returns (uint) {
        return this.test4(x);
    }

    function test2(uint x) public returns (uint) {
        return this.test3(x);
    }

    function test() public returns (uint) {
        return this.test2(1);
    }

}


contract DeployedContractEmpty {}


contract TestContractCreate {
    function test() public returns (address) {
        return new DeployedContractEmpty();
    }
}


contract DeployedContractRetUint {
    function getNumber() public returns(uint) {
        return 3;
    }
}


contract TestContractCreateAndCall {
    function test() public returns (uint) {
        return new DeployedContractRetUint().getNumber();
    }
}


contract TestContractFailedAssertion {

    function test() public {
        assert(false);
    }

}


contract TestContractNoTopicEvent {

    event Log1();

    function test() public {
        emit Log1();
    }

}


contract TestContractOneTopicEvent {

    event Log2(uint indexed x);

    function test() public {
        emit Log2(5);
    }

}


contract TestContractTwoTopicsEvent {

    event Log3(uint indexed x, uint indexed y);

    function test() public {
        emit Log3(5, 6);
    }

}


contract TestContractThreeTopicsEvent {

    event Log4(uint indexed x, uint indexed y, uint indexed z);

    function test() public {
        emit Log4(5, 6, 7);
    }

}


contract TestContractThreeTopicsAndDataEvent {

    event Log4Data(uint indexed x, uint indexed y, uint indexed z, address a);

    function test() public {
        emit Log4Data(5, 6, 7, address(this));
    }

}

contract TestContractMultipleThreeTopicsAndDataEvents {

    event Log4Data(uint indexed x, uint indexed y, uint indexed z, address a);
    event Log4Data2(uint indexed x, uint indexed y, uint indexed z, address a);

    function test() public {
        emit Log4Data(5, 6, 7, address(this));
        emit Log4Data2(7, 8, 9, address(this));
    }

}

contract TestContractDataEvent {

    event LogData(uint x, uint y);

    function test() public {
        emit LogData(4, 5);
    }

}