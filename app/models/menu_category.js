'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu_category = sequelize.define(
    'menu_category',
    {
      name: DataTypes.STRING(191),
      description: DataTypes.STRING(191),
      is_use: DataTypes.ENUM('Y', 'N'),
    },
    {
      underscored: true,
    },
  );
  menu_category.associate = function(models) {
    // associations can be defined here
  };
  return menu_category;
};
