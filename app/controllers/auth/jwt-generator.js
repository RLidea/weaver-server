const jwt = require("jsonwebtoken");
const { privateCert } = require("./jwt-key");
const ISSUER = process.env.APP_NAME;

console.log(typeof privateCert);
const genJwtToken = payload =>
  new Promise((resolve, reject) => {
    jwt.sign(
      { ...payload },
      privateCert,
      {
        algorithm: "RS256",
        expiresIn: "1h",
        issuer: ISSUER
      },
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });

module.exports = Object.assign({}, { genJwtToken });
