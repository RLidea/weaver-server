'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('configs', [{
      key: 'DEFAULT_AUTHORITIES_ID',
      value: '3',
      comment: 'Permissions when first signed up',
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('configs', null, {});
  }
};
