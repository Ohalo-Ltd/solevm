pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;


contract TestContractNoop {

    function test() public pure {

    }

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