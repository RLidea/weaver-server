const logger = require('morgan');
const fs = require('fs');

const printTerminalDev = logger('dev');
const saveFileDev = logger({
  format: 'dev',
  stream: fs.createWriteStream('app.log', { flags: 'w' }),
});
const saveFileDefault = logger({
  format: 'default',
  stream: fs.createWriteStream('app.log', { flags: 'w' }),
});

module.exports = Object.assign(
  {},
  {
    printTerminalDev,
    saveFileDev,
    saveFileDefault,
  },
);
