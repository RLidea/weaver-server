'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      // authorities_id: DataTypes.INTEGER.UNSIGNED,
      email: DataTypes.STRING(191),
      password: DataTypes.STRING(191),
      name: DataTypes.STRING(191),
      phone: DataTypes.CHAR(13),
      files_id: DataTypes.INTEGER.UNSIGNED,
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
    user.hasMany(models.user_authority_relation, {
      foreignKey: 'users_id',
    });
    user.belongsTo(models.file, {
      foreignKey: 'files_id',
    });
  };
  return user;
};
