const util = {};

util.updateOrCreate = async (model, where, newItem, updateItem) => {
  const isExist = await model.findOne({ where });

  try {
    if (!isExist) {
      const result = await model.create(newItem);
      return {
        created: true,
        result,
      };
    }

    await model.update(updateItem, { where });
    return {
      created: false,
      result: updateItem,
    };
  } catch (e) {
    return {
      error: true,
      message: e.name,
    };
  }
};

util.paginate = async (model, options, currentPage, pageLimit) => {
  const { attributes, where, order, include } = options;

  const currentPageNumber = Number(currentPage) > 0 ? currentPage : 1;
  const limit = Number(pageLimit) > 0 ? pageLimit : 30;
  const offset = limit * (currentPageNumber - 1);

  const list = await model.findAll({
    offset,
    limit,
    attributes: attributes !== undefined ? attributes : null,
    where: where !== undefined ? where : null,
    include: include !== undefined ? include : null,
    order: order !== undefined ? order : null,
  });

  const total = await model.count({ where });
  const lastPage = Math.ceil(total / limit);

  return {
    total,
    limit,
    offset,
    currentPage: currentPageNumber,
    lastPage,
    list,
  };
};

module.exports = util;
