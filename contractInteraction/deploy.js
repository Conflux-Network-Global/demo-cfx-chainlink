/* eslint-disable */

const { Conflux, util } = require('js-conflux-sdk');
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

async function main() {
  // const defaultGasPrice = util.unit("GDrip", "Drip")(10)

  const cfx = new Conflux({
    url: 'http://mainnet-jsonrpc.conflux-chain.org:12537',
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
    .sendTransaction({ from: account, chainId: 2})
    .confirmed();
  console.log(receipt); // receipt.contractCreated: 0x8250e53e596dddd6a167a3e6279bfd5ca85115bb
//   {
//   index: 0,
//   epochNumber: 1035303,
//   outcomeStatus: 0,
//   gasUsed: JSBI(1) [ 150175, sign: false ],
//   blockHash: '0x693d784ee4d966fbc8666a20c89435c2690129758dc4fa9c59905301e1bd8838',
//   contractCreated: '0x8250e53e596dddd6a167a3e6279bfd5ca85115bb',
//   from: '0x15fd1e4f13502b1a8be110f100ec001d0270552d',
//   gasFee: '0x47868c0',
//   logs: [],
//   logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
//   stateRoot: '0x2b7618499604f5e5dfc69a140d38acd8fd0550703f3f1796a79e478d7bdd55bf',
//   to: null,
//   transactionHash: '0xf719e4cb4d485fc9dd251dbcf5e89a4f03133c0695cc6a06f6e7051ebdbce4b3'
// }

}

main().catch(e => console.error(e));
