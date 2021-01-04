const fs = require('fs');

const handler = {};

handler.imageFileToBase64String = filePath => {
  const buff = fs.readFileSync(filePath);
  return buff.toString('base64');
};

handler.base64StringToImageFile = (dataString, filePath) => {
  const buff = Buffer.from(dataString, 'base64');
  fs.writeFileSync(filePath, buff);
  return {
    filePath,
  };
};

module.exports = handler;
