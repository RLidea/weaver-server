const Model = require('@models');
const join = require('@utils/join');
const paginate = require('@utils/paginate');
const Schema = require('validate');
const validation = require('@utils/validation');

/*
  Boards
 */
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

/*
  Articles
 */
const articleList = async (req, res, next) => {
  const { boards_id } = req.params;
  const { page, limit } = req.query;

  const result = await paginate({
    model: Model.article,
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

const articleDetail = async (req, res, next) => {
  const { articles_id } = req.params;

  const article = await Model.article.findOne({
    where: {
      id: articles_id,
    },
    include: join.user(Model.user),
  })
    .then(d => d)
    .catch(e => e);

  return res.json(article);
};

const writeArticle = async (req, res, next) => {
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

  // Create Article
  await Model.article.create(params)
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

/*
  Comment
 */
const commentList = async (req, res, next) => {
  const { articles_id } = req.params;
  const { page, limit } = req.query;

  const list = await paginate({
    model: Model.comment,
    where: {
      articles_id,
      deleted_at: null,
    },
    order: [
      ['id', 'DESC'],
    ],
    include: join.user(Model.user),
  }, Number(page), Number(limit));

  return res.json(list);
};

const writeComment = async (req, res, next) => {
  // Parameters
  const { articles_id } = req.params;
  const { users_id, parent_id, contents } = req.body;

  const params = {
    users_id: Number(users_id),
    articles_id: Number(articles_id),
    parent_id: Number(parent_id) || 0,
    contents,
  };

  // Validation Check
  const reqBodySchema = new Schema({
    users_id: validation.check.common.reqPositiveInteger,
    articles_id: validation.check.common.reqPositiveInteger,
    parent_id: validation.check.common.integer,
    contents: validation.check.common.reqString,
  });
  const validationError = reqBodySchema.validate(params);
  if (validationError.length > 0) {
    return res.json({ error: true, message: validationError[0].message });
  }

  // Check DB
  const [isUser, isArticle] = await Promise.all([
    Model.user.count({ where: { id: users_id } }).then(d => d).catch(e => e),
    Model.article.count({ where: { id: articles_id } }).then(d => d).catch(e => e),
  ]);

  if (isUser === 0) {
    return res.json({
      error: true,
      message: 'user_not_found',
    });
  }

  if (isArticle === 0) {
    return res.json({
      error: true,
      message: 'article_not_found',
    });
  }

  if (Number(parent_id) !== 0) {
    const parentComment = await Model.comment.findOne({
      where: {
        id: parent_id,
      },
    })
      .then(d => d)
      .catch(e => {
        return res.json({
          error: true,
          message: e,
        });
      });

    if (parentComment === null) {
      return res.json({
        error: true,
        message: 'comment_not_found',
      });
    }
  }


  // Create Comment
  await Model.comment.create(params);

  return res.json({
    error: false,
    message: 'comment_created',
  });
};

module.exports = {
  boardList,
  articleList,
  articleDetail,
  commentList,
  writeArticle,
  writeComment,
};
