/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

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

  //get next nonce
  const nextNonce = await cfx.getNextNonce(account.address)
  console.log(Number(nextNonce));

  // deploy the contract, and get `contractCreated`
  const receipt = await contract.constructor()
    .sendTransaction({ from: account})
    .confirmed();
  console.log(receipt); // receipt.contractCreated: 0x8aa73841e0a0e6e816b2c66c9c5ed1e144ad8cbb
  // 0x8d6fd7de324a2ac33c753d7c80f79d9afdc42db2 (testnet address)
  // { index: 14,
  // epochNumber: 2952026,
  // outcomeStatus: 0,
  // gasUsed: JSBI [ 150175, sign: false ],
  // blockHash:
  //  '0x38bb0ddeca9f4edbeb0549268f5328f773d56ce02ea79c72db1637bcabf995ab',
  // contractCreated: '0x8aa73841e0a0e6e816b2c66c9c5ed1e144ad8cbb',
  // from: '0x11135d2fcd194785bceb223ad18a45fd66d27a7e',
  // gasFee: '0x47868c0',
  // logs: [],
  // logsBloom:
  //  '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  // stateRoot:
  //  '0x361a01419d5f6cb4dea0a7043101c35ff50377528d45f792c064fcaff0199735',
  // to: null,
  // transactionHash:
  //  '0x9304b36279730f0b750c8c0f02cd79b5220985d966249f74363994350c541e45' }
}

main().catch(e => console.error(e));
