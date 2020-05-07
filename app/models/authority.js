'use strict';
module.exports = (sequelize, DataTypes) => {
  const authority = sequelize.define(
    'authority',
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
  authority.associate = function(models) {
    authority.hasMany(models.authority_menu_relation, {
      foreignKey: 'authorities_id',
    });
    authority.hasMany(models.user_authority_relation, {
      foreignKey: 'authorities_id',
    });
  };
  return authority;
};
