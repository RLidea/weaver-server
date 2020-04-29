const Model = require('@models');
const paginate = require('@utils/pagenate');

module.exports.allUsers = async (pageNum, limit) => {
  const result = await paginate({
    model: Model.user,
    select: ['id', 'email', 'name', 'last_login'],
    where: {
      deleted_at: null,
    },
  }, pageNum, limit);
  return result;
};

module.exports.userCount = async () => {
  const result = await Model.user.findAll().then(d => d);
  return result.length;
};
