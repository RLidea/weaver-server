'use strict';
module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define(
    'language',
    {
      name: DataTypes.STRING(191),
      code: DataTypes.STRING(191),
      english: DataTypes.STRING(191),
      description: DataTypes.STRING(191),
      is_use: DataTypes.ENUM('Y', 'N'),
    },
    {
      underscored: true,
    },
  );
  language.associate = function(models) {
    // associations can be defined here
  };
  return language;
};
