const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userMeta extends Model {
    static associate(models) {
      userMeta.belongsTo(models.user, {
        foreignKey: 'usersId',
      });
    }
  }
  userMeta.init({
    usersId: DataTypes.INTEGER.UNSIGNED,
    name: DataTypes.STRING,
    key: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'userMeta',
  });

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
  return userMeta;
};
