'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('configs', [{
      key: 'DEFAULT_AUTHORITIES_ID',
      value: '3'
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configs', null, {});
  }
};
