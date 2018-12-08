pragma solidity ^0.5.0;


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
        return address(new DeployedContractEmpty());
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


contract DeployedContractRetUintStatic {
    function getNumber() public pure returns(uint) {
        return 3;
    }
}


contract TestContractCreateAndStaticCall {
    function test() public returns (uint) {
        return new DeployedContractRetUintStatic().getNumber();
    }
}


contract TestContractPrecompileRipemd160 {
    function test() public returns (bytes20) {
        bytes memory bts = hex"0102030405060708";
        return ripemd160(bts);
    }
}


contract TestContractPrecompileSha256 {
    function test() public returns (bytes32) {
        bytes memory bts = hex"0102030405060708";
        return sha256(bts);
    }
}


contract CreatedContractReturnsUint {
    function retUint() public pure returns (uint) {
        return 5;
    }
}


contract DeployedContractCreatesNew {
    function retUint() public returns (uint) {
        return new CreatedContractReturnsUint().retUint();
    }
}


contract TestContractMultipleCreate {
    function test() public returns (uint) {
        return new DeployedContractCreatesNew().retUint();
    }
}


contract DeployedContractWithConstructorParams {

    uint public x;
    address public y;

    constructor(uint _x, address _y) public {
        x = _x;
        y = _y;
    }

}


contract TestContractCreateWithConstructorParams {
    function test() public returns (uint, address) {
        DeployedContractWithConstructorParams c = new DeployedContractWithConstructorParams(4, address(5));
        uint x = c.x();
        address y = c.y();
        return (x, y);
    }
}


contract DeployedContractPayable {
    function() external payable {}
}


contract TestContractCreatesPayable {

    constructor() public payable {}

    function test() public payable {
        address(new DeployedContractPayable()).transfer(1);
    }
}


contract TestContractSelfDestructs {
    function test() public payable {
        selfdestruct(msg.sender);
    }
}


contract TestContractCallsB {

    function test() public {
        TestContractCallsD d = new TestContractCallsD();
        TestContractCallsE e = new TestContractCallsE();
        d.callSetN(address(e), 5);
    }
}


contract TestContractCallsC {

    function test() public {
        TestContractCallsD d = new TestContractCallsD();
        TestContractCallsE e = new TestContractCallsE();
        d.delegatecallSetN(address(e), 5);
    }
}


contract TestContractCallsD {

    uint public n;
    address public sender;

    function callSetN(address _e, uint _n) public {
        _e.call(abi.encodeWithSignature("setN(uint256)", _n)); // E's storage is set, D is not modified
    }

    function delegatecallSetN(address _e, uint _n) public {
        _e.delegatecall(abi.encodeWithSignature("setN(uint256)", _n)); // D's storage is set, E is not modified
    }
}


contract TestContractCallsE {

    uint public n;
    address public sender;

    function setN(uint _n) public {
        n = _n;
        sender = msg.sender;
        // msg.sender is D if invoked by D's callcodeSetN. None of E's storage is updated
        // msg.sender is C if invoked by C.foo(). None of E's storage is updated

        // the value of "this" is D, when invoked by either D's callcodeSetN or C.foo()
    }
}