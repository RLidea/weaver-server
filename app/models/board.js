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
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  board.associate = function(models) {
    board.hasMany(models.document, {
      foreignKey: 'boards_id',
    });
  };
  return board;
};
