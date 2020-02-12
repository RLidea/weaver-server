'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      // authorities_id: DataTypes.INTEGER.UNSIGNED,
      email: DataTypes.STRING(191),
      password: DataTypes.STRING(191),
      name: DataTypes.STRING(191),
      files_id: DataTypes.INTEGER.UNSIGNED,
      phone: DataTypes.CHAR(13),
      mobile: DataTypes.CHAR(13),
      fax: DataTypes.CHAR(13),
      wechat_id: DataTypes.STRING(50),
      certicifation_data: DataTypes.STRING(191),
      last_login: DataTypes.DATE,
      salt: DataTypes.STRING(191),
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    },
  );
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};
