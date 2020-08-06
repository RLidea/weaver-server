'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../database/config.js')[env];
const db = {
  address: undefined,
  article: undefined,
  authority: undefined,
  authority_menu_relation: undefined,
  board: undefined,
  comment: undefined,
  common_code: undefined,
  file: undefined,
  group_code: undefined,
  language: undefined,
  menu: undefined,
  menu_category: undefined,
  menu_translation: undefined,
  user: undefined,
  user_authority_relation: undefined,
}; // db 안에 model 이름을 미리 안 넣어도 동작하지만 있으면 개발할때 자동완성이 되서 편하다!

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

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
