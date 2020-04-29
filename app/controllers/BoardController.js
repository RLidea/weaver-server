const Model = require('@models');
const join = require('@utils/join');
const paginate = require('@utils/paginate');
const Schema = require('validate');
const validation = require('@utils/validation');

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
  // Parameters
  const { boards_id } = req.params;
  const { users_id, title, contents, is_notice } = req.body;

  const params = {
    boards_id: Number(boards_id),
    users_id: Number(users_id),
    title,
    contents,
    is_notice: Boolean(JSON.parse(is_notice)),
  };

  // Validation Check
  const reqBodySchema = new Schema({
    boards_id: validation.check.common.reqInteger,
    users_id: validation.check.common.reqInteger,
    title: validation.check.common.reqString,
    contents: validation.check.common.reqString,
    is_notice: validation.check.common.reqBoolean,
  });
  const validationError = reqBodySchema.validate(params);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  // Create Document
  await Model.document.create(params)
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
  // Parameters
  const { documents_id } = req.params;
  const { users_id, parent_id, depth, content } = req.body;

  const params = {
    users_id: Number(users_id),
    documents_id: Number(documents_id),
    parent_id: Number(parent_id) || 0,
    depth: Number(depth) || 0,
    content,
  };

  // Validation Check
  const reqBodySchema = new Schema({
    users_id: validation.check.common.reqPositiveInteger,
    documents_id: validation.check.common.reqPositiveInteger,
    parent_id: validation.check.common.integer,
    depth: validation.check.common.integer,
    content: validation.check.common.reqString,
  });
  const validationError = reqBodySchema.validate(params);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  // Create Comment
  await Model.comment.create(params);

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
