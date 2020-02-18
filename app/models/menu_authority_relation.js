'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu_authority_relation = sequelize.define(
    'menu_authority_relation',
    {
      menus_id: DataTypes.INTEGER.UNSIGNED,
      authorities_id: DataTypes.INTEGER.UNSIGNED,
    },
    {
      underscored: true,
    },
  );
  menu_authority_relation.associate = function(models) {
    menu_authority_relation.belongsTo(models.menu, {
      foreignKey: 'menus_id',
    });
    menu_authority_relation.belongsTo(models.authority, {
      foreignKey: 'authorities_id',
    });
  };
  return menu_authority_relation;
};
