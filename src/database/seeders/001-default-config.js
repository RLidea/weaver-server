'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('configs', [{
      key: 'DEFAULT_AUTHORITIES_ID',
      value: '1'
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configs', null, {});
  }
};
