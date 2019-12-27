const express = require('express');

const router = express.Router();
const AuthController = require('../app/controllers/auth/AuthController');

router
  .route('/login')
  .get(AuthController.viewLogin)
  .post(AuthController.doLogin);

router.route('/api').get(AuthController.testApi);

module.exports = router;
