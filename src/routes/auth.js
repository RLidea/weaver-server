const express = require('express');
const AuthController = require('@controllers/auth/AuthController');

const router = express.Router();

router
  .route('/login')
  .get(AuthController.viewLogin)
  .post(AuthController.doLogin);

router
  .route('/register')
  .get(AuthController.viewRegister)
  .post(AuthController.doRegister);

router.route('/logout').get(AuthController.doLogout);

router
  .route('/reset/password')
  .get(AuthController.showResetUserPassword)
  .post(AuthController.resetUserPassword);

module.exports = router;
