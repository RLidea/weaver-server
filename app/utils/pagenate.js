const Model = require('../../app/models');

module.exports = async (model, currentPageNum, limit, select = [], where = {}) => {
  if (currentPageNum < 1) currentPageNum = 1;
  const offset = limit * (currentPageNum - 1);

  const TargetModel = Model[model];
  const list = await TargetModel.findAll({
    offset,
    limit,
    attributes: select,
    where,
  }).then(data =>
    data.map(item => {
      return item.dataValues;
    }),
  );

  const total_count = await TargetModel.count({
    where,
  });

  const lastPageNum = Math.ceil(total_count / limit);

  return {
    currentPageNum,
    lastPageNum,
    offset,
    limit, // count
    total_count,
    list,
  };
};
