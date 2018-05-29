# Solidity EVM and Runtime (PoC)

This is a simple Ethereum runtime written in Solidity. The runtime contract allows you to execute evm bytecode with calldata and various other parameters. It is meant to be used for one-off execution, like is done with the "evm" executables that comes with the ethereum clients.

This is still very early in development. There is no support for gas metering, and the limit to contract code-size could make it impossible to add. See the roadmap section for the plans ahead.

**NOTE: This is only an experiment in it's early PoC stages. Do not rely on this library to test or verify EVM bytecode.**

### Building and Testing

The runtime is a regular Solidity contract that can be compiled by `solc`, and can therefore be used with libraries such as `web3js` or just executed by the various different stand-alone evm implementations. The limitations is that a lot of gas is required in order to run the code, and that web3js does not have support for Solidity structs (ABI tuples).

In order to build and test the code you need go-ethereum's `evm` as well as `solc` on your path. The code is tested using the solidity `0.4.24` release version and the evm `1.8.7` version - both with constantinople settings.

`bin/compile.js` can be executed to create `bin`, `bin-runtime`, `abi` and `signatures` files for the runtime contract. The files are put in the `bin_output` folder.

`npm run test` can be run to test the runtime contract. It will automatically compile all the involved contracts.

`bin/test.js` can be used to test some of the supporting contracts and libraries.

`bin/perf.js` can be used to compute gas cost estimates for the runtime and supporting libraries.

### Runtime

First of all, the `EthereumRuntime` code is designed to run on a constantinople net, with all constantinople features. The `genesis.json` file in the root folder can be used to configure the geth EVM (through the `--prestate` option).

The executable contract is `EthereumRuntime.sol`. The contract has an `execute` method which is used to run code. It has many overloaded versions, but the simplest version takes two arguments - `code` and `data`.

`code` is the bytecode to run.

`data` is the calldata.

The solidity type for both of them is `bytes memory`.

```
// Execute the given code and call-data.
    function execute(bytes memory code, bytes memory data) public pure returns (Result memory state);

    // Execute the given transaction.
    function execute(TxInput memory input) public pure returns (Result memory result);

    // Execute the given transaction in the given context.
    function execute(TxInput memory input, Context memory context) public pure returns (Result memory result);

```

The other alternatives have two objects, `TxInput` and `Context`:

```
    struct TxInput {
        uint64 gas;
        uint gasPrice;
        address caller;
        uint callerBalance;
        uint value;
        address target;
        uint targetBalance;
        bytes targetCode;
        bytes data;
        bool staticExec;
    }
```

The `gas` and `gasPrice` fields are reserved but never used, since gas is not yet supported. All the other params are obvious except for `staticExec` which should be set to `true` if the call should be executed as a `STATICCALL`, i.e. what used to be called a read-only call (as opposed to a transaction).

```
struct Context {
    address origin;
    uint gasPrice;
    uint gasLimit;
    uint coinBase;
    uint blockNumber;
    uint time;
    uint difficulty;
}
```

These fields all speak for themselves.

NOTE: There is no actual `CREATE` operation taking place for the contract account in which the code is run, i.e. the code to execute would normally be runtime code; however, the code being run can create new contracts.

The return value from the execute functions is a struct on the form:

```
struct Result {
    uint errno;
    uint errpc;
    bytes returnData;
    uint[] stack;
    bytes mem;
    uint[] accounts;
    bytes accountsCode;
    uint[] logs;
    bytes logsData;
}
```

`errno` - an error code. If execution was normal, this is set to 0.

`errpc` - the program counter at the time when execution stopped.

`returnData` - the return data. It will be empty if no data was returned.

`stack` - The stack when execution stopped.

`mem` - The memory when execution stopped.

`accounts` - Account data packed into an uint-array, omitting the account code.

`accountsCode` - The combined code for all accounts.

`logs` - Logs packed into an uint-array, omitting the log data.

`logsData` - The combined data for all logs.

Note that `errpc` is only meant to be used when the error is non-zero, in which case it will be the program counter at the time when the error was thrown.

There is a javascript (typescript) adapter at `script/adapter.ts` which allow you to run the execute function from within this library, and automatically format input and output parameters. The return data is formatted as such:

```
{
    errno: number,
    errpc: number,
    returnData: string (hex),
    stack: [BigNumber],
    mem: string (hex),
    accounts: [{
        address: string (hex),
        balance: BigNumber,
        nonce: BigNumber,
        destroyed: boolean
        storage: [{
            address: BigNumber,
            value: BigNumber
        }]
    }]
    logs: [{
        account: string (hex)
        topics: [BigNumber] (size 4)
        data: string (hex)
    }]
}
```

There is a pretty-print function in the adapter as well.

#### Accounts

Accounts are on the following format:

```
account : {
    addr: address,
    balance: uint,
    nonce: uint8,
    destroyed: bool
    code: bytes
    storage: [{
        addr: uint,
        val: uint
    }]
}
```

`nonce` is restricted to `uint8` (max 255) to make new account creation easier, since it will get a simpler RLP encoding.

The `destroyed` flag is used to indicate whether or not a (contract) account has been destroyed during execution. This can only happen if `SELFDESTRUCT` is called in that contract.

When executing code, two accounts will always be created - the caller account, and the contract account used to run the provided code. In the simple "code + data" call, the caller and contract account are assigned default addresses.

In contract code, accounts and account storage are both arrays instead of maps. Technically they are implemented as (singly) linked lists. This will be improved later.

The "raw" int arrays in the return object has an account packed in the following way:

- `0`: account address

- `1`: account balance

- `2`: account nonce

- `3`: account destroyed (true or false)

- `4`: code starting index (in combined 'accountsCode' array).

- `5`: code size

- `6`: number of entries in storage

- `7`+ : pairs of (address, value) storage entries

The size of an account is thus: `7 + storageEntries*2`.

The `accounts` array is a series of accounts: `[account0, account1, ... ]`

### Logs

Logs are on the following format:

```
log: {
     account: address
     topics: uint[4]
     data: bytes
 }
```

`account` - The address of the account that generated the log entry.

`topics` - The topics.

`data` - The data.

The "raw" int arrays in the return object has a log packed in the following way:

- `0`: account address

- `1 - 4`: topics

- `5`: data starting index (in combined 'logsData' array).

- `6`: data size.

### Blockchain

There are no blocks, so `BLOCKHASH` will always return `0`. The only blockchain related parameters that can be set are those in the context object.

### Javascript

In addition to the contracts, the library also comes with some rudimentary javascript (typescript) for compiling the contract, and for executing unit tests through the geth evm. In order for this to work, both `solc` and the geth `evm` must be on the path.

The `script/adapter.ts` file can be used to call the runtime contract with code and data provided as hex-strings. Currently, only the code + data version and the `TxInput` overload is supported, but the one using both `TxInput` and `Context` will soon be supported as well.

The supporting script will be improved over time.

### Current status

The initial version only lets you run code. There is no gas metering system in place.

Calls are currently being tested, and is not yet verified to work well in all cases. `CALLCODE` has not yet been added (and may not be).

Of the precompiled contracts, only ecrecover, sha256, ripemd160 and identity has been implemented. Neither of them are properly tested.

`CREATE2` has not been added.

### Roadmap

The plan for `0.2.0`, is to support all instructions, and to have a full test suite done.

The plan for `0.3.0` is that the runtime should be properly checked against the yellow paper specification - or at least the parts of the protocol that is supported (gas may never be).

The plan for `0.4.0` is to extend the capacities of the runtime and add some performance optimization. Gas may or may not be added here.

The long-term plan is to add gas metering, and also add a way to add block data, chain settings, and other things. Whether any of that will be possible depends on many things, including the limitations of the EVM and Solidity (such as the maximum allowed code-size for contracts, and Solidity's stack limitations).
