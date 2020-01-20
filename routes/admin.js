const express = require('express');
const router = express.Router();
const AdminController = require('./../app/controllers/AdminController');

/* GET home page. */
router.get('/', function(req, res) {
  res.redirect('/admin/dashboard');
});

router.route('/dashboard').get(AdminController.viewDashboard);

router.route('/users').get(AdminController.viewUsers);

router
  .route('/settings')
  .get(AdminController.viewSetting)
  .post(AdminController.updateSettings);

module.exports = router;
