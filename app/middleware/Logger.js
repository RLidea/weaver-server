const morgan = require('morgan');
const fs = require('fs');
const writeStream = fs.createWriteStream('app.log', { flags: 'w' });

const printTerminalDev = morgan('dev');
const saveFileDev = morgan('dev', {
  stream: writeStream,
});
const saveFileDefault = morgan('combined', {
  stream: writeStream,
});

module.exports = Object.assign(
  {},
  {
    printTerminalDev,
    saveFileDev,
    saveFileDefault,
  },
);
