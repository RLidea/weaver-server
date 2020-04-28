const Model = require('@models');

const boardList = async () => {
  const boards = await Model.board.findAll({
    where: {
      is_use: true,
    },
  }).then((board) => board.map((item) => {
    return item.dataValues;
  }));
  return boards;
};

const documentList = async (req, res, next) => {
  const { boards_id } = req.query;

  const list = await Model.document.findAll({
    where: {
      boards_id,
      deleted_at: null,
    },
    order: [
      ['order', 'DESC'],
      ['id', 'DESC'],
    ],
  })
    .then(d => d)
    .catch(e => e);

  return res.json(list);
};

module.exports = {
  boardList,
  documentList,
};
