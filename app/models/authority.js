'use strict';
module.exports = (sequelize, DataTypes) => {
  const authority = sequelize.define('authority', {
    name: DataTypes.STRING(191),
    description: DataTypes.STRING(191),
    is_use: DataTypes.ENUM('Y', 'N')
  }, {
    underscored: true,
  });
  authority.associate = function(models) {
    // associations can be defined here
  };
  return authority;
};