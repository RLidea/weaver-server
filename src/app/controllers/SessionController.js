const session = require('@utils/session');

const controllers = {};
controllers.session = (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (key === undefined) return res.send('target required');
  session.create(req, res, key, value);
  return res.json({
    data: `${req.session[key]}`,
  });
};

module.exports = controllers;
