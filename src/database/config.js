require('dotenv').config();

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
    user: process.env.MYSQL_USER,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logQueryParameters: true,
  },
  test: {
    ...common,
    user: process.env.MYSQL_TEST_USER,
    username: process.env.MYSQL_TEST_USER,
    password: process.env.MYSQL_TEST_PASSWORD,
    database: process.env.MYSQL_TEST_DATABASE,
    host: process.env.MYSQL_TEST_HOST,
    port: process.env.MYSQL_TEST_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logging: false,
  },
  production: {
    ...common,
    user: process.env.MYSQL_PRODUCTION_USER,
    username: process.env.MYSQL_PRODUCTION_USER,
    password: process.env.MYSQL_PRODUCTION_PASSWORD,
    database: process.env.MYSQL_PRODUCTION_DATABASE,
    host: process.env.MYSQL_PRODUCTION_HOST,
    port: process.env.MYSQL_PRODUCTION_PORT,
    dialect: process.env.DATABASE_DIALECT,
    logging: false,
  },
};
