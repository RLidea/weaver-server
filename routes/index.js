const express = require('express');

const router = express.Router();
const AuthController = require('@controllers/auth/AuthController');
// const MenuController = require('./../app/controllers/MenuController');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authInfo = await AuthController.getAuthInfo(req);
  // console.log(req.i18n);
  res.render('production/index', { title: process.env.APP_NAME, auth: authInfo, text: {} });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

module.exports = router;
