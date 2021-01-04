const fs = require('fs');

const handler = {};

handler.findOrCreate = dir => {
  if (!fs.existsSync(`./${dir}`)) fs.mkdirSync(`./${dir}`);
  return dir;
};

handler.createMonthlyDir = dir => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() > 8 ? now.getMonth() + 1 : `0${now.getMonth() + 1}`;

  handler.findOrCreate(`./${dir}/${year}`);
  handler.findOrCreate(`./${dir}/${year}/${month}`);

  return `${dir}/${year}/${month}`;
};

module.exports = handler;
