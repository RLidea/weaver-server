'use strict';
module.exports = (sequelize, DataTypes) => {
  const authority_menu_relation = sequelize.define('authority_menu_relation', {
    authorities_id: DataTypes.INTEGER.UNSIGNED,
    menus_id: DataTypes.INTEGER.UNSIGNED
  }, {
    createdAt   : 'created_at',
    updatedAt   : 'updated_at',
    timestamps  : true,
    underscored : true,
  });
  authority_menu_relation.associate = function(models) {
    // associations can be defined here
  };
  return authority_menu_relation;
};
