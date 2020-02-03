const userModel = require('../../app/models').user;
const paginate = require('./../utils/pagenate');

module.exports.allUsers = async (pageNum, limit) => {
  const result = await paginate('user', pageNum, limit, {
    deleted_at: null,
  });
  // console.log(result);
  return result;
};

module.exports.userCount = async () => {
  const result = await userModel.findAll().then(d => d);
  return result.length;
};
