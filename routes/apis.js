const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  return res.send('api!');
});

module.exports = router;
