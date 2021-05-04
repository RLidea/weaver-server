/* eslint global-require:0 */
/*
 * middleware loaders
 */
module.exports = {
  expressLoader: require('./express'),
  corsLoader: require('./cors'),
  csrfLoader: require('./csrf'),
  allowedUrlLoader: require('./allowedUrl'),
  errorLoader: require('./error'),
  configValidation: require('./configValidation'),
};
