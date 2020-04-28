'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu_category = sequelize.define(
    'menu_category',
    {
      name: DataTypes.STRING(191),
      description: DataTypes.STRING(191),
      is_use: DataTypes.BOOLEAN,
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  menu_category.associate = function(models) {
    menu_category.hasMany(models.menu, {
      foreignKey: 'menu_categories_id',
    });
  };
  return menu_category;
};
