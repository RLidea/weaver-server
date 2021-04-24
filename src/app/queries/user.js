const { user, userMeta } = require('@models');

user.findDetailById = (usersId) => {
  return user.findOne({
    attributes: {
      exclude: [
        'password',
        'salt',
      ],
    },
    where: { id: usersId },
    include: [{
      model: userMeta,
    }],
  });
};

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

module.exports = user;
