const express = require('express');
const BoardController = require('@controllers/BoardController');

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('api!');
});

router.route('/list/:id').get(BoardController.documentList);
router.route('/docs/:id').get(BoardController.documentDetail);

router.route('/comment/:id').get(BoardController.commentList);

module.exports = router;
