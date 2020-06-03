const express = require("express");
const bodyParser = require("body-parser");
const { Conflux } = require("js-conflux-sdk");
require("dotenv").config();

const app = express();
const port = 5001;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const main = () => {
  app.use(bodyParser.json());

  app.post("/", async (req, res) => {
    console.log("POST Data: ", req.body);
    const output = { id: req.body.id };

    //create conflux instance
    const cfx = new Conflux({
      url: "http://mainnet-jsonrpc.conflux-chain.org:12537",
      // url: "http://testnet-jsonrpc.conflux-chain.org:12537",
      defaultGasPrice: 100,
      defaultGas: 1000000,
      logger: console,
    });

    const account = cfx.Account(PRIVATE_KEY); // create account instance
    console.log(account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

    // create contract instance
    const contract = cfx.Contract({
      abi: require("../contractInteraction/contract/abi.json"), //can be copied from remix
      address: "0x8aa73841e0a0e6e816b2c66c9c5ed1e144ad8cbb",
      // address: "0x8d6fd7de324a2ac33c753d7c80f79d9afdc42db2",
    });

    const keys = Object.keys(req.body.data);
    for (let i = 0; i < keys.length; i++) {
      console.log(keys[i]);
      const key = keys[i];

      // interact with contract
      const receipt = await contract[key](req.body.data[key])
        .sendTransaction({ from: account })
        .confirmed();
      console.log(receipt);
    }

    res.status(200).send(output);
  });

  app.listen(port, () => console.log(`${port} is active`));

  process.on("SIGINT", () => {
    process.exit();
  });
};

main();
