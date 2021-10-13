const crypto = require("crypto");

function sign(data, secret) {
  const hmac = crypto.createHmac("sha1", secret);
  const ourSignature = `sha1=${hmac.update(data).digest("hex")}`;
  return ourSignature;
}

exports.verify = function verify(signature, data, secret) {
  const sig = Buffer.from(signature, "utf8");
  const signed = Buffer.from(sign(data, secret), "utf8");

  if (sig.length !== signed.length || !crypto.timingSafeEqual(sig, signed)) {
    return false;
  } else {
    return true;
  }
};