const Model = require('@models');
const join = require('@utils/join');
const pagenate = require('@utils/pagenate');

const boardList = async () => {
  return Model.board.findAll({
    where: {
      is_use: true,
    },
  }).then((board) => board.map((item) => {
    return item.dataValues;
  }));
};

const documentList = async (req, res, next) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const result = await pagenate({
    model: Model.document,
    where: {
      boards_id: id,
      deleted_at: null,
    },
    order: [
      ['order', 'DESC'],
      ['id', 'DESC'],
    ],
    include: join.user(Model.user),
  }, Number(page), Number(limit));
  return res.json(result);
};

const documentDetail = async (req, res, next) => {
  const { id } = req.params;

  const doc = await Model.document.findOne({
    where: {
      id,
    },
    include: join.user(Model.user),
  })
    .then(d => d)
    .catch(e => e);

  return res.json(doc);
};

const commentList = async (req, res, next) => {
  const { id } = req.params;
  const { page, limit } = req.query;

  const list = await pagenate({
    model: Model.comment,
    where: {
      documents_id: id,
      deleted_at: null,
    },
    order: [
      ['id', 'DESC'],
    ],
    include: join.user(Model.user),
  }, Number(page), Number(limit));

  return res.json(list);
};

module.exports = {
  boardList,
  documentList,
  documentDetail,
  commentList,
};
