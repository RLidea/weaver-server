const express = require('express');
const router = express.Router();
const AuthController = require('./../app/controllers/auth/AuthController');

/* GET home page. */
router.get('/', function(req, res, next) {
  const isAuthorized = AuthController.isAuthorized(req, res, next);
  res.render('admin/index', { title: process.env.APP_NAME, isAuthorized: isAuthorized.toString() });
});

module.exports = router;
