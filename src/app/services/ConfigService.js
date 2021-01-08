const Model = require('@models');

const service = {};

service.get = (key) => {
  return Model.config.findOne({
    where: { key },
  });
};

service.create = (key, value, comment) => {
  return Model.config.create({ key, value, comment });
};

service.update = (key, value, comment) => {
  return Model.config.update(
    { value, comment },
    { where: { key } },
  );
};

service.delete = (key) => {
  return Model.config.destroy({
    where: { key },
  });
};

module.exports = service;
