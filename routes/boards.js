const express = require('express');
const BoardController = require('@controllers/BoardController');

const router = express.Router();

router
  .route('/')
  .get(BoardController.boardList);

router
  .route('/:boards_id/docs')
  .get(BoardController.documentList);

router
  .route('/:boards_id/docs/:documents_id')
  .get(BoardController.documentDetail)
  .post(BoardController.writeDocument);

router
  .route('/:boards_id/docs/:documents_id/comment')
  .get(BoardController.commentList)
  .post(BoardController.writeComment);

module.exports = router;
