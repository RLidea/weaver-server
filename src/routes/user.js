const express = require('express');

const UserController = require('@controllers/UserController');
const fileUpload = require('@utils/fileUpload');

const router = express.Router();

router
  .route('/:usersId')
  .get(UserController.item)
  .put(fileUpload.localStorage('profileImage').single('image'), UserController.updateItem);

module.exports = router;
