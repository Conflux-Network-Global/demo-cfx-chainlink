/* eslint-disable */

const { Conflux } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  const cfx = new Conflux({
    // url: 'http://main.confluxrpc.org',
    url: 'http://test.confluxrpc.org',
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
    address: "0x8ac6bf0700ed41d1323a1f9c16d85d76f1196cdb",
  });

  // //get next nonce
  // const nextNonce = await cfx.getNextNonce(account.address)
  // console.log(Number(nextNonce));

  // interact with contract
  const receipt = await contract.update(1)
    .sendTransaction({ from: account})
    .executed();
  console.log("Transaction Receipt: ", receipt);
}

main().catch(e => console.error(e));
