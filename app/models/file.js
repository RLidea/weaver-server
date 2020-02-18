'use strict';
module.exports = (sequelize, DataTypes) => {
  const file = sequelize.define(
    'file',
    {
      documents_id: DataTypes.INTEGER.UNSIGNED,
      comments_id: DataTypes.INTEGER.UNSIGNED,
      type: DataTypes.ENUM('IMAGE', 'ETC'),
      url: DataTypes.TEXT,
      thumbnail_url: DataTypes.TEXT,
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    },
  );
  file.associate = function(models) {
    file.belongsTo(models.document, {
      foreignKey: 'documents_id',
    });
  };
  return file;
};
