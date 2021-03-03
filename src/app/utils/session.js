const fs = require('fs');
const encryption = require('@system/encryption');

// session directory
const varDir = `${__dirname}/../../../var`;
const sessionDir = `${varDir}/session`;
if (!fs.existsSync(varDir)) fs.mkdirSync(varDir);
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

const utils = {};

utils.create = (req, res, target, key) => {
  if (!fs.existsSync(varDir)) fs.mkdirSync(varDir);
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);

  switch (target) {
    case 'instant':
      res.session.instant = encryption.createHash(`${(new Date()).getTime()}`, 'salt')?.substring(0, 7);
      break;
    default:
      if (key === undefined) {
        if (req.session[target] === undefined) {
          req.session[target] = 1;
        } else {
          req.session[target] += 1;
        }
      } else {
        req.session[target] = key;
      }
      break;
  }

  return req.session[target];
};

module.exports = utils;
