const express = require('express');
const BoardController = require('@controllers/BoardController');

const router = express.Router();

router
  .route('/')
  .get(BoardController.boardList);

router
  .route('/:boards_id/article')
  .get(BoardController.articleList);

router
  .route('/:boards_id/article/:articles_id')
  .get(BoardController.articleDetail)
  .post(BoardController.writeArticle);

router
  .route('/:boards_id/article/:articles_id/comment')
  .get(BoardController.commentList)
  .post(BoardController.writeComment);

module.exports = router;
