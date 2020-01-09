'use strict';
module.exports = (sequelize, DataTypes) => {
  const common_code = sequelize.define(
    'common_code',
    {
      group_codes_id: DataTypes.INTEGER.UNSIGNED,
      parent_id: DataTypes.INTEGER.UNSIGNED,
      name: DataTypes.STRING(191),
      data: DataTypes.TEXT,
      description: DataTypes.STRING(191),
    },
    {
      underscored: true,
    },
  );
  common_code.associate = function(models) {
    // associations can be defined here
  };
  return common_code;
};
