const express = require("express");
const bodyParser = require("body-parser");
const { Conflux } = require("js-conflux-sdk");

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const app = express();
const port = 5000;
let currentDate = new Date();

const main = () => {
  app.use(bodyParser.json());

  //POST endpoint for handling CL node calls for sending SMS
  app.post("/", async (req, res) => {
    console.log("POST Data: ", req.body);
    const output = { id: req.body.id };

    //new conflux instance
    const cfx = new Conflux({
      url: "http://main.confluxrpc.org",
      defaultGasPrice: 100,
      defaultGas: 1000000,
      logger: console,
    });
    // create contract instance
    const contract = cfx.Contract({
      abi: require("../contractInteraction/contract/abi.json"), //can be copied from remix
    });
    //decode information for sending
    const data = contract.abi.decodeLog(req.body.data);
    console.log(data);

    //sending SMS messages
    client.messages
      .create({
        body: `New Event: ${data.object.caller},  ${Number(
          data.object.current
        )}`,
        from: `+${process.env.TWILIO_NUMBER}`,
        to: `+${process.env.OUTGOING_NUMBER}`,
      })
      .then((message) => console.log(message.sid));

    res.status(200).send(output);
  });

  //POST endpoitn for handling CL node calls for checking for new messages
  app.post("/check", async (req, res) => {
    newDate = new Date(); //date stored to not pull all texts, just new ones

    const data = {};
    //checking received SMS messages
    await client.messages
      .list({
        dateSent: currentDate,
        to: `+${process.env.TWILIO_NUMBER}`,
      })
      .then((messages) =>
        messages.forEach((m) => {
          //message post processing
          if (m.from === `+${process.env.OUTGOING_NUMBER}`) {
            const msgParts = m.body.split(" ");
            if (msgParts.length >= 2) {
              data[msgParts[0]] = msgParts[1];
            }
          }
        })
      );

    //returning response to CL node
    currentDate = newDate;
    console.log(data);
    res.status(200).send({
      jobRunID: req.body.id,
      data,
    });
  });

  app.listen(port, () => console.log(`${port} is active`));

  process.on("SIGINT", () => {
    process.exit();
  });
};

main();
