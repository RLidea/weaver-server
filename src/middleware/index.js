/*
 * middleware loaders
 */
const expressLoader = require('./express');
const corsLoader = require('./cors');
const allowedUrlLoader = require('./allowedUrl');
const errorLoader = require('./error');
const configValidation = require('./configValidation');

module.exports = {
  expressLoader,
  corsLoader,
  allowedUrlLoader,
  errorLoader,
  configValidation,
};
