const express = require("express");
const bodyParser = require("body-parser");
const { Conflux } = require("js-conflux-sdk");
require("dotenv").config();

const app = express();
const port = 5001;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const main = () => {
  app.use(bodyParser.json());

  //POST endpoint for handling CL node calls
  app.post("/", async (req, res) => {
    console.log("POST Data: ", req.body);
    const output = { id: req.body.id };

    //create conflux instance
    const cfx = new Conflux({
      url: "http://test.confluxrpc.org",
      defaultGasPrice: 100,
      defaultGas: 1000000,
      // logger: console,
    });

    const account = cfx.Account(PRIVATE_KEY); // create account instance
    console.log("Address: ", account.address); // 0x1bd9e9be525ab967e633bcdaeac8bd5723ed4d6b

    // create contract instance
    const contract = cfx.Contract({
      abi: require("../contractInteraction/contract/abi.json"), //can be copied from remix
      address: "0x8ac6bf0700ed41d1323a1f9c16d85d76f1196cdb",
    });

    //loops through transactions if multiple messages are found
    const keys = Object.keys(req.body.data);
    for (let i = 0; i < keys.length; i++) {
      // console.log(keys[i]);
      const key = keys[i];

      // interact with contract
      const receipt = await contract[key](req.body.data[key])
        .sendTransaction({ from: account})
        .executed();
      console.log("Transaction Hash: ", receipt.transactionHash);
    }

    res.status(200).send(output);
  });

  app.listen(port, () => console.log(`${port} is active`));

  process.on("SIGINT", () => {
    process.exit();
  });
};

main();
