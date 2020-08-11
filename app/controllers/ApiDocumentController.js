/*
  API Document Insomnia documenter
 */
const Model = require('@models');

const docs = (req, res, next) => {
  return res.render('docs/index');
};

const history = async (req, res) => {
  const data = await Model.api_document.findAll({
    order: [['id', 'desc']],
  })
    .then(r => r.map(i => {
      return i.dataValues;
    }));
  return res.json(data);
};

const config = async (req, res) => {
  const apiVersion = req.cookies.api_version;

  const where = { is_use: 1 };
  if (apiVersion !== undefined) {
    where.id = apiVersion;
  }

  const data = await Model.api_document.findOne({
    where,
    order: [['id', 'desc']],
  })
    .then(r => r.dataValues.content);
  return res.json(JSON.parse(data));
};

module.exports = {
  docs,
  history,
  config,
};
