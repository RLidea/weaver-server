'use strict';
module.exports = (sequelize, DataTypes) => {
  const api_document = sequelize.define('api_document', {
    version: DataTypes.STRING,
    content: DataTypes.STRING,
    memo: DataTypes.STRING,
    is_use: DataTypes.BOOLEAN
  }, {
    underscored: true,
  });
  api_document.associate = function(models) {
    // associations can be defined here
  };
  return api_document;
};