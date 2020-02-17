'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define(
    'comment',
    {
      users_id: DataTypes.INTEGER,
      documents_id: DataTypes.INTEGER,
      parent_id: DataTypes.INTEGER,
      depth: DataTypes.INTEGER,
      content: DataTypes.STRING,
    },
    {
      underscored: true,
    },
  );
  comment.associate = function(models) {
    // associations can be defined here
  };
  return comment;
};
