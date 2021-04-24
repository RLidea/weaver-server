const { config } = require('@models');

config.findByKey = (key) => {
  return config.findOne({
    where: { key },
  });
};

config.findValueByKey = (key) => {
  return config.findOne({
    where: { key },
  })
    .then(r => r.value);
};

config.deleteByKey = (key) => {
  return config.destroy({
    where: { key },
  });
};

module.exports = config;
