const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pino = require("pino");
const path = require("path");
const verification = require("./verification");
const utils = require("./utils");

// --------------------------------------------------------------------------------- //

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const secret = process.env.SECRET;
const db_uri = process.env.DB_CONNECTION;
const provider = process.env.PROVIDER;
const sigHeaderName = utils.getHeader(provider);

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();
app.use(bodyParser.json());

let Schema, collectionSchema, collection;
mongoose.connect(db_uri, { autoCreate: false });
const connection = mongoose.connection;
connection.once("open", function () {
  logger.info("MongoDB connection established");
  Schema = mongoose.Schema;
  collectionSchema = new Schema({}, { strict: false });
  collection = mongoose.model(provider, collectionSchema);
});

// --------------------------------------------------------------------------------- //

function verifyPostData(req, _, next) {
  if (req.query.trusted) {
    if (req.query.trusted == process.env.TRUST_KEY) {
      return next();
    } else {
      logger.info("Trust key is wrong");
    }
  }

  const payload = JSON.stringify(req.body);

  if (!payload) {
    return next("Request body empty");
  }

  if (!verification.verify(req.get(sigHeaderName), payload, secret)) {
    return next("Request body digest did not match");
  }

  return next();
}

function response(req, res) {
  logger.debug("Data received");
  const collectionData = new collection(req.body);
  collectionData.save();
  res.status(200).send();
}

// --------------------------------------------------------------------------------- //

app.get("/", function (_, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post(["/github", "/gitlab", "/gitea", "/gogs"], verifyPostData, response);

// --------------------------------------------------------------------------------- //

app.use((err, _, res, __) => {
  if (err) logger.error(err);
  res.status(403).send("Request body was not signed or verification failed");
});

logger.info("Handler is runnig");

app.listen(3000);
