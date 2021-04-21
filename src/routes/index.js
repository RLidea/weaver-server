const express = require('express');

const router = express.Router();
const authService = require('@services/authService');
const MailController = require('@controllers/MailController');
const swagger = require('@middleware/swaggerDoc')();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authInfo = await authService.getAuthState(req);
  res.render('production/index', { title: process.env.APP_NAME, auth: authInfo, text: {} });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

router.get('/expired', (req, res, next) => {
  res.render('expired', { title: process.env.APP_NAME });
});

/* API Document */
router.use('/docs', swagger?.path, swagger?.handlers);

/* Send email */
router.post('/mail', MailController.send);

module.exports = router;
