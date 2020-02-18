'use strict';
module.exports = (sequelize, DataTypes) => {
  const language = sequelize.define(
    'language',
    {
      name: DataTypes.STRING(191),
      code: DataTypes.STRING(191),
      english: DataTypes.STRING(191),
      description: DataTypes.STRING(191),
      is_use: DataTypes.BOOLEAN,
    },
    {
      underscored: true,
    },
  );
  language.associate = function(models) {
    const arr = ['menu_translation'];
    for (let i = 0, l = arr.length; i < l; i += 1) {
      language.hasMany(models[arr[i]], {
        foreignKey: 'languages_id',
      });
    }
  };
  return language;
};
