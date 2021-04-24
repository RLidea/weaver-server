const express = require('express');
const AuthController = require('@controllers/auth/AuthController');
const OAuthController = require('@controllers/auth/OAuthController');

const router = express.Router();

/*
  auth
 */
router
  .route('/login')
  .get(AuthController.viewLogin)
  .post(AuthController.doLogin);

router
  .route('/register')
  .get(AuthController.viewRegister)
  .post(AuthController.doRegister);

router
  .route('/logout')
  .get(AuthController.doLogout);
/*
  oAuth
 */
router
  .route('/kakao')
  .get(OAuthController.doKakaoAuth);

router
  .route('/naver')
  .get(OAuthController.doNaverAuth);

/*
  reset password
 */
router
  .route('/reset/password')
  .get(AuthController.showResetUserPassword)
  .put(AuthController.resetUserPassword);

router
  .route('/reset/code')
  .get(AuthController.getResetCode);

module.exports = router;
