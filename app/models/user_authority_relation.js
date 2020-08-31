'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_authority_relation = sequelize.define(
    'user_authority_relation',
    {
      authorities_id: DataTypes.INTEGER.UNSIGNED,
      users_id: DataTypes.INTEGER.UNSIGNED,
    },
    {
      createdAt   : 'created_at',
      updatedAt   : 'updated_at',
      timestamps  : true,
      underscored : true,
    },
  );
  user_authority_relation.associate = function(models) {
    user_authority_relation.belongsTo(models.user, {
      foreignKey: 'users_id',
    });
    user_authority_relation.belongsTo(models.authority, {
      foreignKey: 'authorities_id',
    });
  };
  return user_authority_relation;
};


