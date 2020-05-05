'use strict';
module.exports = (sequelize, DataTypes) => {
  const article = sequelize.define(
    'article',
    {
      boards_id: DataTypes.INTEGER.UNSIGNED,
      parent_id: DataTypes.INTEGER.UNSIGNED,
      users_id: DataTypes.INTEGER.UNSIGNED,
      title: DataTypes.STRING,
      contents: DataTypes.TEXT,
      order: DataTypes.INTEGER,
      is_notice: DataTypes.BOOLEAN,
      view_count: DataTypes.INTEGER.UNSIGNED,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  article.associate = function(models) {
    article.belongsTo(models.board, {
      foreignKey: 'boards_id',
    });
    article.belongsTo(models.user, {
      foreignKey: 'users_id',
    });
    article.hasMany(models.file, {
      foreignKey: 'articles_id',
    });
    article.hasMany(models.comment, {
      foreignKey: 'articles_id',
    });
  };
  return article;
};
