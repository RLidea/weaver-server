const express = require('express');
const AuthController = require('@controllers/auth/AuthController');

const router = express.Router();

router
  .route('/login')
  .get(AuthController.viewLogin);

router
  .route('/register')
  .get(AuthController.viewRegister);

router
  .route('/reset/password')
  .get(AuthController.showResetUserPassword);

module.exports = router;
