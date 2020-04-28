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
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  menu_translation.associate = function(models) {
    menu_translation.belongsTo(models.menu, {
      foreignKey: 'menus_id',
    });
    menu_translation.belongsTo(models.language, {
      foreignKey: 'languages_id',
    });
  };
  return menu_translation;
};
