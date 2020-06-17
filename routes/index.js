const express = require('express');

const router = express.Router();
const AuthController = require('@controllers/auth/AuthController');
const AuthService = require('@services/AuthService');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);
  res.render('production/index', { title: process.env.APP_NAME, auth: authInfo, text: {} });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

router.get('/csrf', AuthController.getCsrfToken);

module.exports = router;
