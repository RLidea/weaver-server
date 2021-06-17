/* eslint global-require: 0 */

const loader = (app) => {
  app.use('/', require('./index'));
  app.use('/auth', require('./auth'));
  app.use('/users', require('./user'));
};

module.exports = loader;
