'use strict';
module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define(
    'address',
    {
      users_id: DataTypes.INTEGER.UNSIGNED,
      address_codes_id: DataTypes.INTEGER.UNSIGNED,
      zip_code: DataTypes.CHAR(6),
      detail: DataTypes.STRING(191),
      mobile: DataTypes.CHAR(13),
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  address.associate = function(models) {};
  return address;
};
