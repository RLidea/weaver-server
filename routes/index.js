const express = require('express');
const router = express.Router();
const AuthController = require('./../app/controllers/auth/AuthController');
// const MenuController = require('./../app/controllers/MenuController');

/* GET home page. */
router.get('/', function(req, res, next) {
  const isAuthorized = AuthController.isAuthorized(req);
  // console.log(isAuthorized.toString());
  res.render('production/index', { title: process.env.APP_NAME, isAuthorized: isAuthorized.toString() });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

// router

module.exports = router;
