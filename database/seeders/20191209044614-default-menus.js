'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('menus', [{
      id: 1,
      name: 'Dashboard',
      uri: '/dashboard',
      description: '',
      is_use: 'Y'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menus', null, {});
  }
};
