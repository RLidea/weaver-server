'use strict';
const {
  Model
} = require('sequelize');
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
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userMeta',
  });
  return userMeta;
};
