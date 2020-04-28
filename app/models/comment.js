'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    'comment',
    {
      users_id: DataTypes.INTEGER.UNSIGNED,
      documents_id: DataTypes.INTEGER.UNSIGNED,
      parent_id: DataTypes.INTEGER.UNSIGNED,
      depth: DataTypes.INTEGER.UNSIGNED,
      content: DataTypes.STRING(191),
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    },
  );
  comment.associate = function(models) {
    comment.belongsTo(models.document, {
      foreignKey: 'documents_id',
    });
    comment.belongsTo(models.user, {
      foreignKey: 'documents_id',
    });
  };
  return comment;
};