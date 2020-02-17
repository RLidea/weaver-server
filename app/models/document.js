'use strict';
module.exports = (sequelize, DataTypes) => {
  const document = sequelize.define(
    'document',
    {
      users_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      contents: DataTypes.TEXT,
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
