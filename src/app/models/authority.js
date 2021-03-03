'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class authority extends Model {
    static associate(models) {
      authority.hasMany(models.userAuthorityRelation, {
        foreignKey: 'authoritiesId',
      });
    }
  }
  authority.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isUse: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'authority',
  });
  return authority;
};
