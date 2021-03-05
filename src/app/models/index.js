'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { logger } = require('@system/logger')
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../database/config.js')[env];

// Database schema
const db = {
  config: undefined,
  apiDocument: undefined,
  authority: undefined,
  user: undefined,
  userAuthorityRelation: undefined,
  oAuthMeta: undefined,
}; // db 안에 model 이름을 미리 안 넣어도 동작하지만 있으면 개발할때 자동완성이 되서 편하다!

// Sequelize settings
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  { ...config,
    timezone: '+09:00',
    seederStorage: 'sequelize',
    migrationStorageTableName: 'sequelize_meta',
    seederStorageTableName: 'sequelize_data',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
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
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    // db 에 기록할 때, db[model.name] 를 콘솔로 확인해보면 편하다!
    // console.log(db[model.name]);
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
