/*
  models: It only maps the db structure.
 */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { logger } = require('@system/logger');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/no-dynamic-require
const config = require(`${__dirname}/../../database/config.js`)[env];

// db 안에 model 이름을 미리 안 넣어도 동작하지만 있으면 개발할때 자동완성이 되서 편하다!
const target = {
  config: undefined,
  authority: undefined,
  user: undefined,
  userAuthorityRelation: undefined,
  oAuthMeta: undefined,
  userMeta: undefined,
};

// Database schema
const db = {
  ...target,
};

// Sequelize settings
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    benchmark: true,
    logging: (query, time) => {
      if (query !== 'Executed (default): SELECT 1+1 AS result') {
        global.logger.dev('');
        logger.sql(`${time}ms 🔍\n${query}`);
      }
    },
  },
);

// Database access alert
try {
  sequelize.authenticate();
  logger.system('🟢 The database is connected.');
} catch (error) {
  logger.error(`🔴 Unable to connect to the database: ${error}.`);
}

// get models
fs.readdirSync(__dirname)
  .filter(filename => {
    return filename.indexOf('.') !== 0 && filename !== basename && filename.slice(-3) === '.js';
  })
  .forEach(filename => {
    try {
      const model = sequelize.import(path.join(__dirname, filename));
      db[model.name] = model;
    } catch (e) {
      logger.devError(`🔴 A fatal error has occurred in ${filename}`);
      logger.devError(e);
      logger.error(e.toString());
    }
  });

Object.keys(db).forEach(modelName => {
  try {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  } catch (e) {
    logger.devError(`🔴 A fatal error has occurred in ${modelName}`);
    logger.devError(e);
    logger.error(e.toString());
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.target = target;

module.exports = db;
