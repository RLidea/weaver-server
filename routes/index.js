const express = require('express');
const router = express.Router();
const AuthController = require('./../app/controllers/auth/AuthController');
// const MenuController = require('./../app/controllers/MenuController');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const authInfo = await AuthController.getAuthInfo(req);
  res.render('production/index', { title: process.env.APP_NAME, auth: authInfo });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

router.get('/en', (req, res) => {
  req.i18n.changeLanguage('en');
  res.send(req.t('admin.demo'));
});

router.get('/ko', (req, res) => {
  req.i18n.changeLanguage('ko');
  res.send(req.t('admin.demo'));
});

module.exports = router;
