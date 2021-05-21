const express = require('express');

const UserController = require('@controllers/UserController');
const fileUpload = require('@utils/fileUpload');

const router = express.Router();

router
  .route('/')
  .get(UserController.list);

router
  .route('/:usersId')
  .get(UserController.item)
  .put(fileUpload.localStorage('profileImage').single('image'), UserController.updateItem)
  .delete(UserController.deleteItem);

module.exports = router;
