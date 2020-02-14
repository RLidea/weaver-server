'use strict';
module.exports = (sequelize, DataTypes) => {
  const group_code = sequelize.define(
    'group_code',
    {
      name: DataTypes.STRING(191),
      description: DataTypes.STRING(191),
    },
    {
      underscored: true,
    },
  );
  group_code.associate = function(models) {
    group_code.hasMany(models.common_code, {
      foreignKey: 'group_codes_id',
    });
  };
  return group_code;
};
