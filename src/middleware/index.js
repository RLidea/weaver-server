/*
 * middleware loaders
 */
const expressLoader = require('./express');
const corsLoader = require('./cors');
const allowedUrlLoader = require('./allowedUrl');
const errorLoader = require('./error');

module.exports = {
  expressLoader,
  corsLoader,
  allowedUrlLoader,
  errorLoader,
};
