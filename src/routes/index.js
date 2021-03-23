const express = require('express');

const router = express.Router();
const ApiDocumentController = require('@controllers/ApiDocumentController');
const AuthService = require('@services/AuthService');
// const SessionController = require('@controllers/SessionController');
const MailController = require('@controllers/MailController');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authInfo = await AuthService.getAuthInfo(req);
  res.render('production/index', { title: process.env.APP_NAME, auth: authInfo, text: {} });
});

router.get('/not_allowed', (req, res, next) => {
  res.render('not_allowed', { title: process.env.APP_NAME });
});

// router.post('/session/:key', SessionController.session);

router.get('/expired', (req, res, next) => {
  res.render('expired', { title: process.env.APP_NAME });
});

/* API Document */
router.get('/docs/documents', ApiDocumentController.list);
// router.get('/docs', (req, res) => {
//   return res.redirect('/docs/recent');
// });
router.get('/docs', ApiDocumentController.view);
router.get('/insomnia.json', ApiDocumentController.document);

router.post('/mail', MailController.send);

module.exports = router;
