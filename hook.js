const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pino = require("pino");
const path = require("path");

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const secret = process.env.SECRET;
const db_uri = process.env.DB_CONNECTION;
const sigHeaderName = process.env.SIGNATURE;

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const app = express();
app.use(bodyParser.json());

let Schema, collectionSchema, collection;
mongoose.connect(db_uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  logger.info("MongoDB connection established");
  Schema = mongoose.Schema;
  collectionSchema = new Schema({}, { strict: false });
  collection = mongoose.model("github", collectionSchema);
});

function sign(data) {
  const hmac = crypto.createHmac("sha1", secret);
  const ourSignature = `sha1=${hmac.update(data).digest("hex")}`;
  return ourSignature;
}

function verify(signature, data) {
  const sig = Buffer.from(signature, "utf8");
  const signed = Buffer.from(sign(data, "utf8"));
  if (sig.length !== signed.length) {
    return false;
  }
  return crypto.timingSafeEqual(sig, signed);
}

function verifyPostData(req, _, next) {
  const payload = JSON.stringify(req.body);

  if (!payload) {
    return next("Request body empty");
  }

  if (!verify(req.get(sigHeaderName), payload)) {
    return next(`Request body digest did not match`);
  }

  return next();
}

app.get("/", function (_, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/hook", verifyPostData, function (req, res) {
  const collectionData = new collection(req.body);
  collectionData.save();
  logger.debug("Data received");
  res.status(200).send();
});

app.use((err, _, res, __) => {
  if (err) logger.error(err);
  res.status(403).send("Request body was not signed or verification failed");
});

logger.info("Handler is runnig");

app.listen(3000);
