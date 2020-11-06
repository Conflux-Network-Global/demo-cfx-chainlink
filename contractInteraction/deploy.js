/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://test.confluxrpc.org',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    logger: console,
  });

  console.log(cfx.defaultGasPrice); // 100
  console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account(PRIVATE_KEY); // create account instance
  console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('./contract/abi.json'), //can be copied from remix
    bytecode: require('./contract/bytecode.json'), //on remix, found in compilation details => web3deploy => data (should be a hex string)
    // address is empty and wait for deploy
  });

  // estimate deploy contract gas use
  const estimate = await contract.constructor().estimateGasAndCollateral();
  console.log(JSON.stringify(estimate)); // {"gasUsed":"175050","storageCollateralized":"64"}

  //get next nonce
  const nextNonce = await cfx.getNextNonce(account.address)
  console.log(Number(nextNonce));

  // deploy the contract, and get `contractCreated`
  const receipt = await contract.constructor()
    .sendTransaction({ from: account})
    .executed();
  console.log(receipt); // receipt.contractCreated: 0x8ac6bf0700ed41d1323a1f9c16d85d76f1196cdb
  // {//   index: 0,
//   epochNumber: 857738,
//   outcomeStatus: 0,
//   gasUsed: JSBI(1) [ 150175, sign: false ],
//   gasFee: JSBI(1) [ 15017500, sign: false ],
//   blockHash: '0xb4e9d6dace2eef95d9333026df27a846412bf4b9bf8fdc23ce26ed1e8071e890',
//   contractCreated: '0x8ac6bf0700ed41d1323a1f9c16d85d76f1196cdb',
//   from: '0x15fd1e4f13502b1a8be110f100ec001d0270552d',
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   stateRoot: '0x17fdd771546668832ace0e345d950a09171b7d84f48cd2e25315d9ecd00287ff',
//   to: null,
//   transactionHash: '0x85daf6671f6e612dec51f65231e6f542c917358ef7bdd376e0512a7aae0aba5c',
//   txExecErrorMsg: null
// }



}

main().catch(e => console.error(e));
