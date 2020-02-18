'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      email: DataTypes.STRING(191),
      password: DataTypes.STRING(191),
      name: DataTypes.STRING(191),
      phone: DataTypes.CHAR(13),
      profile_image_url: DataTypes.TEXT,
      profile_thumbnail_url: DataTypes.TEXT,
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
    user.hasMany(models.document, {
      foreignKey: 'users_id',
    });
    user.hasMany(models.comment, {
      foreignKey: 'users_id',
    });
  };
  return user;
};
