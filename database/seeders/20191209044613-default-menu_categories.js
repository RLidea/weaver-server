'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'menu_categories',
      [
        {
          id: 1,
          name: 'Admin',
          description: 'Admin Page Category',
          is_use: true,
        },
        {
          id: 2,
          name: 'default',
          description: 'Main Page Category',
          is_use: true,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menu_categories', null, {});
  },
};
