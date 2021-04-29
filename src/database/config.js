require('dotenv').config();

const config = require('@root/src/config');

const common = {
  timezone: '+09:00',
  seederStorage: 'sequelize',
  migrationStorageTableName: 'MigrationHistory',
  seederStorageTableName: 'SeederHistory',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  },
};

module.exports = {
  development: {
    ...common,
    user: config.database.MYSQL_USER,
    username: config.database.MYSQL_USER,
    password: config.database.MYSQL_PASSWORD,
    database: config.database.MYSQL_DATABASE,
    host: config.database.MYSQL_HOST,
    port: config.database.MYSQL_PORT,
    dialect: config.database.DATABASE_DIALECT,
    logQueryParameters: true,
  },
  test: {
    ...common,
    user: config.database.MYSQL_TEST_USER,
    username: config.database.MYSQL_TEST_USER,
    password: config.database.MYSQL_TEST_PASSWORD,
    database: config.database.MYSQL_TEST_DATABASE,
    host: config.database.MYSQL_TEST_HOST,
    port: config.database.MYSQL_TEST_PORT,
    dialect: config.database.DATABASE_DIALECT,
    logging: false,
  },
  production: {
    ...common,
    user: config.database.MYSQL_PRODUCTION_USER,
    username: config.database.MYSQL_PRODUCTION_USER,
    password: config.database.MYSQL_PRODUCTION_PASSWORD,
    database: config.database.MYSQL_PRODUCTION_DATABASE,
    host: config.database.MYSQL_PRODUCTION_HOST,
    port: config.database.MYSQL_PRODUCTION_PORT,
    dialect: config.database.DATABASE_DIALECT,
    logging: false,
  },
};
