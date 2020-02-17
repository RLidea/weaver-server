'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define(
    'file',
    {
      type: DataTypes.ENUM('image', 'document', 'etc'),
      url: DataTypes.TEXT,
      thumbnail_url: DataTypes.TEXT,
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    },
  );
  file.associate = function(models) {
    file.hasMany(models.user, {
      foreignKey: 'files_id',
    });
  };
  return file;
};
