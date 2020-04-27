const Model = require('@models');

module.exports = async (model, currentPageNum, limit, select = [], where = {}) => {
  const pageNum = currentPageNum < 1 ? 1 : currentPageNum;
  const offset = limit * (pageNum - 1);

  const TargetModel = Model[model];
  const list = await TargetModel.findAll({
    offset,
    limit,
    attributes: select,
    where,
  }).then(data => data.map(item => {
    return item.dataValues;
  }));

  const total_count = await TargetModel.count({
    where,
  });

  const lastPageNum = Math.ceil(total_count / limit);

  return {
    currentPageNum: pageNum,
    lastPageNum,
    offset,
    limit, // count
    total_count,
    list,
  };
};
