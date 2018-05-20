# Solidity EVM and Runtime (PoC)

This is a (partial) implementation of the Ethereum runtime in Solidity. The runtime contract allows you to execute evm bytecode with calldata and various other parameters. It is meant to be used for one-off execution, like is done with the "evm" executables that comes with the ethereum clients.

**NOTE: This is only an experiment in it's early PoC stages. Do not rely on this library to test or verify EVM bytecode.**

### Running

The executable contract is `EthereumRuntime.sol`. The contract has an `execute` method which is used to run code. It has many overloaded versions, but the simplest version takes two arguments - `code` and `data`.

`code` is the bytecode to run.

`data` is the calldata.

The solidity type for both of them is `bytes memory`.

The return value is a struct on the form:

```
struct Result {
    uint errno;
    uint errpc;
    bytes returnData;
    uint[] stack;
    bytes mem;
    uint[] accounts;
    bytes[] accountsCode;
}
```

`errno` - an error code. If execution was normal, this is set to 0.

`errpc` - the program counter at the time when execution stopped.

`returnData` - the return data. It will be empty if no data was returned.

`stack` - The stack when execution stopped.

`mem` - The memory when execution stopped.

`accounts` - Account data packed into an uint-array, omitting the account code.

`accountsCode` - The code associated with each account.

The raw output has an account packed in the following way:

- `0`: account address

- `1`: account balance

- `2`: account nonce

- `3`: number of entries in storage

- `4`+ : pairs of (address, value) storage entries

The size of an account is thus: `4 + storageEntries*2`.

The `accounts` array is a series of accounts: `[account0, account1, ... ]`

There is a javascript (typescript) adapter at `script/adapter.ts` which allow you to run the execute function and automatically format input and output parameters. The return data is formatted as such:

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
        storage: [{
            address: BigNumber,
            value: BigNumber
        }]
    }]
}
```

### Building and Testing

The runtime is a regular Solidity contract that can be compiled by `solc`, and can therefore be used with libraries such as `web3js` or just executed by the various different stand-alone evm implementations. The one limitation is that a lot of gas is required in order to run the code.

In order to build and run this code, you need go-ethereum's `evm` as well as `solc` on your path. The code is tested using the solidity `0.4.24` release version and the evm `1.8.7` version.

`bin/compile.js` can be executed to create `bin`, `bin-runtime`, `abi` and `signatures` files for the runtime contract. The files are put in the `bin_output` folder. The compile executable must be run before the jest tests can be run. 

After creating these files, `npm run test` can be run to test the runtime contract. It has a number of tests for the different (available) opcodes. There will be more tests and available opcodes with time.

`bin/test.js` can be run to test some of the supporting contracts and libraries. Note that this command overwrites the `bin_output` folder contents, so if you want to run `npm run test` again, you will need to recompile using `bin/compile.js` again.


### The runtime

Accounts are modeled according to the yellow paper, and are kept in memory while transactions are processed.

Two accounts are always created - the caller account, and the contract account used for the provided code. In the simple "code + data" call, the caller and contract account are assigned default addresses.

In contract code, accounts and account storage are both arrays instead of maps. Technically they are implemented as (singly) linked lists. This will be improved later.

There are no blocks, so `BLOCKHASH` will always return `0`, but there is a simple context:

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

### Javascript

In addition to the contracts, the library also comes with some rudimentary javascript (typescript) for compiling the contract, and for executing unit tests through the geth evm. In order for this to work, both `solc` and the geth `evm` must be on the path.

To work with this code, it is recommended to use typescript over plain javascript.

The `script/adapter.ts` file can be used to call the runtime contract with code and data provided as hex-strings. Currently, only the code + data overload is supported, but the ones using `TxInput` and `Context` will soon be supported as well.

The supporting script will be improved over time.

### Current status

The initial version only lets you run simple code. There is no gas metering system in place, and a limited possibility for adding other tx input and context.

Log and call instructions have not yet been added.

### Plans

The plan for `0.2.0`, is to support all instructions, and to have a full test suite done.

The plan for `0.3.0` is to extend the capacities of the runtime and add some performance optimization.

The long-term plan is to add gas metering, and also add a way to add block data, chain settings, and other things. Whether any of that will be possible depends on many things, including the limitations of the EVM and Solidity.
