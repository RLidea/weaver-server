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
      order: DataTypes.INTEGER.UNSIGNED,
      is_notice: DataTypes.BOOLEAN,
      view_count: DataTypes.INTEGER.UNSIGNED,
      deleted_at: DataTypes.DATE,
    },
    {
      underscored: true,
    },
  );
  document.associate = function(models) {
    // associations can be defined here
  };
  return document;
};
