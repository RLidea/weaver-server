'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu_translation = sequelize.define(
    'menu_translation',
    {
      name: DataTypes.STRING,
      menus_id: DataTypes.INTEGER.UNSIGNED,
      languages_id: DataTypes.INTEGER.UNSIGNED,
    },
    {
      underscored: true,
    },
  );
  menu_translation.associate = function(models) {
    // associations can be defined here
  };
  return menu_translation;
};
