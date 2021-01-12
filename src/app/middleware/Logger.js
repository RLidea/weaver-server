const morgan = require('morgan');
const { stream } = require('@system/logger');

const middleware = {};

middleware.development = morgan('dev', { stream });
middleware.production = morgan('combined', { stream });

module.exports = middleware;
