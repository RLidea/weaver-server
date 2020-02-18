'use strict';
module.exports = (sequelize, DataTypes) => {
  const board = sequelize.define(
    'board',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      is_use: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
    },
  );
  board.associate = function(models) {
    // associations can be defined here
  };
  return board;
};
