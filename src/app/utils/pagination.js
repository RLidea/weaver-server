module.exports = async (options, currentPageNum, limit) => {
  const { model, select, where, order, include } = options;

  const pageNum = Number(currentPageNum) > 0 ? currentPageNum : 1;
  const pageLimit = Number(limit) > 0 ? limit : 10;
  const offset = pageLimit * (pageNum - 1);

  const list = await model.findAll({
    offset,
    limit: pageLimit,
    attributes: select !== undefined ? select : null,
    where: where !== undefined ? where : null,
    include: include !== undefined ? include : null,
    order: order !== undefined ? order : null,
  }).then(data => data.map(item => {
    return item.dataValues;
  }));

  const totalCount = await model.count({
    where,
  });

  const lastPageNum = Math.ceil(totalCount / limit);

  return {
    currentPageNum: pageNum,
    lastPageNum,
    offset,
    limit: pageLimit, // count
    totalCount,
    list,
  };
};
