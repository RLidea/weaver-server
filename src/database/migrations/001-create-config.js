const format = require('../columnFormat');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('configs', {
      id: format.id,
      key: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      createdAt: format.createdAt,
      updatedAt: format.updatedAt,
      deletedAt: format.deletedAt,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('configs');
  },
};
