/*
  API Document Insomnia documenter
 */
const fs = require('fs');

const controllers = {};

controllers.view = (req, res, next) => {
  return res.render('docs/index');
};

controllers.list = async (req, res) => {
  const result = [];
  fs.readdirSync(`${__dirname}/../../../var/apiDocs`).forEach(file => {
    result.push({
      version: file,
    });
  });
  return res.json(result);
};

controllers.document = async (req, res) => {
  const apiVersion = String(req.cookies.api_version);
  const fileList = [];
  const dir = `${__dirname}/../../../var/apiDocs`;
  let data = '';
  try {
    data = fs.readFileSync(`${dir}/${apiVersion}`);
  } catch (e) {
    fs.readdirSync(dir).forEach(file => {
      fileList.push(file);
    });
    data = fs.readFileSync(`${dir}/${fileList[fileList.length - 1]}`);
  }
  return res.json(JSON.parse(data));
};

module.exports = controllers;
