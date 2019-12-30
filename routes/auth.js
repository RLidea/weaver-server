const express = require('express');

const router = express.Router();
const AuthController = require('../app/controllers/auth/AuthController');
// const AuthTokenController = require('../app/controllers/auth/AuthTokenController');

router.route('/login').get(AuthController.viewLogin);
router.route('/login').post(AuthController.doLogin);

router.route('/tokens').post(AuthController.createToken);
router.route('/users').get(AuthController.viewLogin);

module.exports = router;
