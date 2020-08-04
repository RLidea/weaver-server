const updateOrCreate = async (model, where, newItem, updateItem) => {
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

module.exports = {
  updateOrCreate,
};
