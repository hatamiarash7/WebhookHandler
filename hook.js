const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const pino = require("pino");
const expressPino = require("express-pino-logger");

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

const secret = process.env.SECRET;
const db_uri = process.env.DB_CONNECTION;
const sigHeaderName = process.env.SIGNATURE;

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const expressLogger = expressPino({ logger });

const app = express();
app.use(expressLogger);
app.use(bodyParser.json());

let Schema;
mongoose.connect(db_uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  logger.info("MongoDB connection established");
  Schema = mongoose.Schema;
});

function verifyPostData(req, res, next) {
  const payload = JSON.stringify(req.body);

  if (!payload) {
    return next("Request body empty");
  }

  const sig = req.get(sigHeaderName) || "";
  const hmac = crypto.createHmac("sha1", secret);
  const digest = Buffer.from(
    "sha1=" + hmac.update(payload).digest("hex"),
    "utf8"
  );
  const checksum = Buffer.from(sig, "utf8");

  if (
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  ) {
    return next(
      `Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`
    );
  }

  return next();
}

app.post("/", verifyPostData, function (req, res) {
  const collectionSchema = new Schema({}, { strict: false });
  const collection = mongoose.model("github", collectionSchema);
  const collectionData = new collection(req.body);
  collectionData.save();
  logger.debug("Data received");
  res.status(200).send();
});

app.use((err, req, res, next) => {
  if (err) console.error(err);
  logger.error("Request body was not signed or verification failed");
  res.status(403).send("Request body was not signed or verification failed");
});

logger.debug("Handler is runnig");

app.listen(3000);
