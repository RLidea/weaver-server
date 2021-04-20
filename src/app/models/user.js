const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.userAuthorityRelation, {
        foreignKey: 'usersId',
      });
      user.hasMany(models.oAuthMeta, {
        foreignKey: 'usersId',
      });
      user.hasMany(models.userMeta, {
        foreignKey: 'usersId',
      });
    }
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    profileImageUrl: DataTypes.TEXT,
    profileThumbnailUrl: DataTypes.TEXT,
    phone: DataTypes.CHAR,
    certificationDate: DataTypes.DATE,
    lastLogin: DataTypes.DATE,
    salt: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
    timestamps: true,
    paranoid: true,
  });

  user.findByEmail = (email) => {
    return user.findOne({
      attributes: {
        exclude: [
          'password',
          'salt',
        ],
      },
      where: {
        email,
      },
    });
  };

  user.findById = (id) => {
    return user.findOne({
      attributes: {
        exclude: [
          'password',
          'salt',
        ],
      },
      where: {
        id,
      },
    });
  };

  user.updateLastLogin = (usersId) => {
    return user.update({
      lastLogin: new Date(),
    }, {
      where: { id: usersId },
      silent: true,
    });
  };

  user.updateLastLoginByEmail = (email) => {
    return user.update({
      lastLogin: new Date(),
    }, {
      where: { email },
      silent: true,
    });
  };

  user.updatePasswordByEmail = ({
    email, hashPassword, salt,
  }) => {
    return user.update({
      password: hashPassword,
      salt,
    }, {
      where: { email },
    });
  };
  return user;
};
