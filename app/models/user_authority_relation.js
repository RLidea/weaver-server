'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_authority_relations = sequelize.define(
    'user_authority_relation',
    {
      authorities_id: DataTypes.INTEGER.UNSIGNED,
      users_id: DataTypes.INTEGER.UNSIGNED,
    },
    {
      underscored: true,
    },
  );
  user_authority_relations.associate = function(models) {
    // associations can be defined here
  };
  return user_authority_relations;
};
