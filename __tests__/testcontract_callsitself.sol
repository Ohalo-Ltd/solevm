pragma experimental "v0.5.0";
pragma experimental ABIEncoderV2;
pragma solidity ^0.4.22;

contract TestContractCallsItself {

    function test2() public returns (uint) {
        return 1;
    }

    function test() public returns (uint) {
        return this.test2() + 2;
    }

}