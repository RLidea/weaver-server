'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    'comment',
    {
      users_id: DataTypes.INTEGER.UNSIGNED,
      articles_id: DataTypes.INTEGER.UNSIGNED,
      parent_id: DataTypes.INTEGER.UNSIGNED,
      depth: DataTypes.INTEGER.UNSIGNED,
      content: DataTypes.STRING(191),
      order: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  comment.associate = function(models) {
    comment.belongsTo(models.article, {
      foreignKey: 'articles_id',
    });
    comment.belongsTo(models.user, {
      foreignKey: 'articles_id',
    });
    comment.hasMany(models.comment, {
      as: 'children',
      foreignKey: 'parent_id',
    });
  };
  return comment;
};
