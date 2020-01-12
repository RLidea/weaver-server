'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define(
    'menu',
    {
      name: DataTypes.STRING(191),
      uri: DataTypes.STRING(191),
      order: DataTypes.INTEGER.UNSIGNED,
      description: DataTypes.STRING(191),
      is_use: DataTypes.ENUM('Y', 'N'),
    },
    {
      underscored: true,
    },
  );
  menu.associate = function(models) {
    // associations can be defined here
  };
  return menu;
};
