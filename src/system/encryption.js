const crypto = require('crypto');

const handler = {};

handler.createHash = (password, salt) => {
  return crypto
    .createHash('sha512')
    .update(password + salt)
    .digest('hex');
};

handler.pbkdf2 = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
};

module.exports = handler;
