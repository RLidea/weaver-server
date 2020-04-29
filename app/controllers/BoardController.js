const Model = require('@models');
const join = require('@utils/join');
const paginate = require('@utils/paginate');

const boardList = async (req, res, next) => {
  const list = await Model.board.findAll({
    where: {
      is_use: true,
    },
  })
    .then(d => d)
    .catch(e => e);

  return res.json(list);
};

const documentList = async (req, res, next) => {
  const { boards_id } = req.params;
  const { page, limit } = req.query;

  const result = await paginate({
    model: Model.document,
    where: {
      boards_id,
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
  const { documents_id } = req.params;

  const doc = await Model.document.findOne({
    where: {
      id: documents_id,
    },
    include: join.user(Model.user),
  })
    .then(d => d)
    .catch(e => e);

  return res.json(doc);
};

const commentList = async (req, res, next) => {
  const { documents_id } = req.params;
  const { page, limit } = req.query;

  const list = await paginate({
    model: Model.comment,
    where: {
      documents_id,
      deleted_at: null,
    },
    order: [
      ['id', 'DESC'],
    ],
    include: join.user(Model.user),
  }, Number(page), Number(limit));

  return res.json(list);
};

const writeDocument = async (req, res, next) => {
  const { boards_id } = req.params;
  const { users_id, title, contents, is_notice } = req.body;

  await Model.document.create({
    boards_id: Number(boards_id),
    users_id: Number(users_id),
    title,
    contents,
    is_notice: Boolean(JSON.parse(is_notice)),
  })
    .then(d => d)
    .catch(e => {
      return res.json({
        error: true,
        message: e,
      });
    });

  return res.json({
    error: false,
  });
};

const writeComment = async (req, res, next) => {
  const { documents_id } = req.params;
  const { users_id, parent_id, depth, content } = req.body;

  await Model.comment.create({
    users_id,
    documents_id,
    parent_id,
    depth,
    content,
  });

  return res.json({
    error: false,
  });
};

module.exports = {
  boardList,
  documentList,
  documentDetail,
  commentList,
  writeDocument,
  writeComment,
};
