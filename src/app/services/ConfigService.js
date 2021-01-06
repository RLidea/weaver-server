const Model = require('@models');

const service = {};

service.get = (key) => {
  return Model.config.findOne({
    where: {
      key,
    },
  });
};

module.exports = service;
