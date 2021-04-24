const { userMeta } = require('@models');

userMeta.createAll = ({ t, prefix, usersId, data }) => {
  const keys = Object.keys(data);
  const promises = [];
  keys.forEach(key => {
    promises.push(data.create({
      usersId,
      name: `${prefix}_${key}`,
      key,
      value: data[key],
    }, { transaction: t })
      .catch(err => {
        global.logger.devError(err);
        return false;
      }));
  });

  return Promise.all(promises);
};

module.exports = userMeta;
