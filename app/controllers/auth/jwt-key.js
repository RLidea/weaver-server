const fs = require("fs");
const path = require("path");

const privateKeyFilePath = process.env.JWT_PRIVATE_KEY;

const privateCert = fs.readFileSync(privateKeyFilePath);
const jwtValidityKey = "jwt-validity";

module.exports = Object.assign(
  {},
  {
    privateCert,
    jwtValidityKey
  }
);