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
      underscored: true,
    },
  );
  authority.associate = function(models) {
    authority.hasMany(models.menu_authority_relation, {
      foreignKey: 'authorities_id',
    });
    authority.hasMany(models.user_authority_relation, {
      foreignKey: 'authorities_id',
    });
  };
  return authority;
};
