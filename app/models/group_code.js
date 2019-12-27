'use strict';
module.exports = (sequelize, DataTypes) => {
  const group_code = sequelize.define('group_code', {
    name: DataTypes.STRING(191),
    description: DataTypes.STRING(191)
  }, {
    underscored: true,
  });
  group_code.associate = function(models) {
    // associations can be defined here
  };
  return group_code;
};