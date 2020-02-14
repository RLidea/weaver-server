'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define(
    'menu',
    {
      parent_id: DataTypes.INTEGER.UNSIGNED,
      // name: DataTypes.STRING(191),
      menu_categories_id: DataTypes.INTEGER.UNSIGNED,
      uri: DataTypes.STRING(191),
      depth: DataTypes.INTEGER.UNSIGNED,
      order: DataTypes.INTEGER.UNSIGNED,
      description: DataTypes.STRING(191),
      is_use: DataTypes.ENUM('Y', 'N'),
    },
    {
      underscored: true,
    },
  );
  menu.associate = function(models) {
    menu.hasMany(models.menu_translation, {
      foreignKey: 'menus_id',
    });
  };
  return menu;
};
