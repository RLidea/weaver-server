'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define(
    'file',
    {
      articles_id: DataTypes.INTEGER.UNSIGNED,
      comments_id: DataTypes.INTEGER.UNSIGNED,
      type: DataTypes.ENUM('IMAGE', 'ETC'),
      url: DataTypes.TEXT,
      thumbnail_url: DataTypes.TEXT,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  file.associate = function(models) {
    file.belongsTo(models.article, {
      foreignKey: 'articles_id',
    });
  };
  return file;
};
