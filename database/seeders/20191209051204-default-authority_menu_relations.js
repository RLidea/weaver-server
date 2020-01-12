'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'authority_menu_relations',
      [
        {
          id: 1,
          authorities_id: 1,
          menus_id: 1,
        },
        {
          id: 2,
          authorities_id: 1,
          menus_id: 2,
        },
        {
          id: 3,
          authorities_id: 1,
          menus_id: 3,
        },
        {
          id: 4,
          authorities_id: 2,
          menus_id: 1,
        },
        {
          id: 5,
          authorities_id: 2,
          menus_id: 2,
        },
        {
          id: 6,
          authorities_id: 2,
          menus_id: 3,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('authority_menu_relations', null, {});
  },
};
