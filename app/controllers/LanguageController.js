const Model = require('@models');

module.exports.getLanguagesId = async (language_code) => {
  const id = await Model.language
    .findOne({
      where: {
        code: language_code,
      },
    })
    .then((lng) => lng.dataValues.id);
  return id;
};
