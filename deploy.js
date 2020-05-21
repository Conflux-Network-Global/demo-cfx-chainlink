/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    url: 'http://testnet-jsonrpc.conflux-chain.org:12537',
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

  // deploy the contract, and get `contractCreated`
  const receipt = await contract.constructor()
    .sendTransaction({ from: account })
    .confirmed();
  console.log(receipt); // receipt.contractCreated: 0x8d83e6a0b245f023ff02147dc19a65c4e1e091a1
  // { index: 0,
  // epochNumber: 2394334,
  // outcomeStatus: 0,
  // gasUsed: JSBI [ 149439, sign: false ],
  // blockHash:
  //  '0x372464585b5c5e22928b74676f1804593e86f65f7f2e3086cc37dd5502391ac4',
  // contractCreated: '0x8d83e6a0b245f023ff02147dc19a65c4e1e091a1',
  // from: '0x11135d2fcd194785bceb223ad18a45fd66d27a7e',
  // gasFee: '0x47868c0',
  // logs: [],
  // logsBloom:
  //  '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  // stateRoot:
  //  '0x50200a8e248f29762d79932f722a7802c5c32a86823d8e8ac4bd2109a88ee40f',
  // to: null,
  // transactionHash:
  //  '0x8fc85277b15ed036b607c1cdaa38e6e37e8b29599eafcab42a6e02b8379895db' }
}

main().catch(e => console.error(e));
