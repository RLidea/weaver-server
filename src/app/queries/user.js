const formatter = require('@utils/formatter');
const queryHelper = require('@utils/query');
const { user, userMeta } = require('@models');

user.paginate = (page, limit) => {
  return queryHelper.paginate(
    user,
    {
      attributes: {
        exclude: [
          'password',
          'salt',
        ],
      },
      include: [{
        model: userMeta,
        attributes: {
          exclude: [
            'usersId',
          ],
        },
      }],
    },
    page,
    limit,
  );
};

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

user.updateProfile = ({
  usersId, email, name, phone, imageUrl, imageThumbUrl,
}) => {
  const params = {
    usersId, email, name, phone, imageUrl, imageThumbUrl,
  };
  return user.update(
    formatter.removeUndefined(params),
    {
      where: { id: usersId },
    },
  ).catch(e => {
    return e;
  });
};

user.removeById = (usersId) => {
  return user.destroy({
    where: {
      id: usersId,
    },
  });
};

module.exports = user;
