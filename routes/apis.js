const express = require('express');
const BoardController = require('@controllers/BoardController');

const router = express.Router();

router.get('/', (req, res) => {
  return res.send('api!');
});

router.route('/board').get(BoardController.articleList());

module.exports = router;
