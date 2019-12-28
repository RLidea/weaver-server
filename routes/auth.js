const express = require('express');
const passport = require('passport');

const router = express.Router();
const AuthController = require('../app/controllers/auth/AuthController');
// const AuthTokenController = require('../app/controllers/auth/AuthTokenController');

router
  .route('/login')
  .get(AuthController.viewLogin)
  .post(AuthController.doLogin);

router.route('/tokens').post(AuthController.createToken);
router.get('/users', passport.authenticate('jwt', { session: false }), AuthController.viewLogin);

module.exports = router;
