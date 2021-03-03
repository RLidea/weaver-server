/*
  API Document Insomnia documenter
 */
const Model = require('@models');

const docs = (req, res, next) => {
  return res.render('docs/index');
};

const history = async (req, res) => {
  const data = await Model.apiDocument.findAll({
    isUse: 1,
    order: [['id', 'desc']],
  })
    .then(r => r.map(i => {
      return i.dataValues;
    }));
  return res.json(data);
};

const config = async (req, res) => {
  const apiVersion = String(req.cookies.api_version);
  const where = {
    isUse: 1,
    id: apiVersion,
  };

  const data = await Model.apiDocument.findOne({
    where,
    order: [['id', 'desc']],
  })
    .then(r => r.dataValues.content)
    .catch(async () => {
      const recent = await Model.apiDocument.findOne({
        where: {
          isUse: 1,
        },
        order: [['createdAt', 'DESC']],
      });
      return recent.dataValues.content;
    });
  return res.json(JSON.parse(data));
};

module.exports = {
  docs,
  history,
  config,
};
