const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userAuthorityRelation extends Model {
    static associate(models) {
      userAuthorityRelation.belongsTo(models.user, {
        foreignKey: 'usersId',
      });
      userAuthorityRelation.belongsTo(models.authority, {
        foreignKey: 'authoritiesId',
      });
    }
  }
  userAuthorityRelation.init({
    authoritiesId: DataTypes.INTEGER.UNSIGNED,
    usersId: DataTypes.INTEGER.UNSIGNED,
  }, {
    sequelize,
    modelName: 'userAuthorityRelation',
    timestamps: true,
  });

  userAuthorityRelation.findByUsersId = (usersId) => {
    return userAuthorityRelation.findOne({
      where: { usersId },
    });
  };
  return userAuthorityRelation;
};
