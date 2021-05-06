const express = require('express');

const router = express.Router();
const authService = require('@services/authService');
const MailController = require('@controllers/MailController');
const SecureController = require('@controllers/SecureController');
const swagger = require('@middleware/swaggerDoc')();
const config = require('@root/src/config');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authInfo = await authService.getAuthState(req);
  res.render('production/index', { title: config.env.APP_NAME, auth: authInfo, text: {} });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: config.env.APP_NAME });
});

router.get('/expired', (req, res, next) => {
  res.render('expired', { title: config.env.APP_NAME });
});

/* API Document */
router.use('/docs', swagger?.path, swagger?.handlers);

/* Send email */
router.post('/mail', MailController.send);

router.get('/csrf', SecureController.csrf);

module.exports = router;
