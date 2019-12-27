'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    authorities_id: DataTypes.INTEGER.UNSIGNED,
    id_name: DataTypes.STRING(191),
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
    deleted_at: DataTypes.DATE
  }, {
    underscored: true,
  });
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};