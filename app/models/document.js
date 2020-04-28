'use strict';
module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define(
    'document',
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
  document.associate = function(models) {
    document.belongsTo(models.board, {
      foreignKey: 'boards_id',
    });
    document.belongsTo(models.user, {
      foreignKey: 'users_id',
    });
    document.hasMany(models.file, {
      foreignKey: 'documents_id',
    });
    document.hasMany(models.comment, {
      foreignKey: 'documents_id',
    });
  };
  return document;
};
