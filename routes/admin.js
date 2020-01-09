const express = require('express');
const router = express.Router();
const AdminController = require('./../app/controllers/AdminController');

/* GET home page. */
router.route('/dashboard').get(AdminController.viewDashboard);
router.route('/settings').get(AdminController.viewSetting);
router.route('/settings').post(AdminController.updateSettings);

module.exports = router;
