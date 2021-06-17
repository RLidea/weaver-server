/* eslint global-require:0 */
/*
 * middleware loaders
 */
module.exports = {
  express: require('./express'),
  cors: require('./cors'),
  csrf: require('./csrf'),
  allowedUrl: require('./allowedUrl'),
  error: require('./error'),
  configValidation: require('./configValidation'),
};
