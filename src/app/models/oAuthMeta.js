'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class oAuthMeta extends Model {
    static associate(models) {
      oAuthMeta.belongsTo(models.user, {
        foreignKey: 'usersId',
      });
    }
  }
  oAuthMeta.init({
    usersId: DataTypes.INTEGER.UNSIGNED,
    service: DataTypes.STRING,
    accountId: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    refreshToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'oAuthMeta',
    timestamps: true,
    paranoid: true,
  });
  return oAuthMeta;
};
