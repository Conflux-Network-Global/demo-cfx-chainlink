/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    url: 'http://main.confluxrpc.org',
    // url: 'http://test.confluxrpc.org',
    defaultGasPrice: 100,
    defaultGas: 1000000,
    // logger: console,
  });

  // console.log(cfx.defaultGasPrice); // 100
  // console.log(cfx.defaultGas); // 1000000

  // ================================ Account =================================
  const account = cfx.Account(PRIVATE_KEY); // create account instance
  console.log("Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

  // ================================ Contract ================================
  // create contract instance
  const contract = cfx.Contract({
    abi: require('./contract/abi.json'), //can be copied from remix
    address: "0x8250e53e596dddd6a167a3e6279bfd5ca85115bb",
    // address: "0x8d6fd7de324a2ac33c753d7c80f79d9afdc42db2"
  });

  // //get next nonce
  // const nextNonce = await cfx.getNextNonce(account.address)
  // console.log(Number(nextNonce));

  // interact with contract
  const receipt = await contract.update(1)
    .sendTransaction({ from: account, chainId: 2})
    .confirmed();
  console.log("Transaction Receipt: ", receipt);
}

main().catch(e => console.error(e));
