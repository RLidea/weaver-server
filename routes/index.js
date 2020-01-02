const express = require('express');
const router = express.Router();
const AuthController = require('./../app/controllers/auth/AuthController');

/* GET home page. */
router.get('/', function(req, res, next) {
  const isAuthorized = AuthController.isAuthorized(req, res, next);
  console.log(isAuthorized.toString());
  res.render('index', { title: 'Weaver', isAuthorized: isAuthorized.toString() });
});

module.exports = router;
