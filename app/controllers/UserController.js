const Model = require('@models');
const paginate = require('@utils/paginate');

const allUsers = async (pageNum, limit) => {
  const result = await paginate({
    model: Model.user,
    select: ['id', 'email', 'name', 'last_login'],
    where: {
      deleted_at: null,
    },
  }, pageNum, limit);
  return result;
};

const userCount = async () => {
  const result = await Model.user.findAll().then(d => d);
  return result.length;
};

module.exports = {
  allUsers,
  userCount,
};
