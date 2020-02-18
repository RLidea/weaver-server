'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'authority_menu_relations',
      [
        {
          authorities_id: 1,
          menus_id: 1,
        },
        {
          authorities_id: 1,
          menus_id: 2,
        },
        {
          authorities_id: 1,
          menus_id: 3,
        },
        {
          authorities_id: 2,
          menus_id: 1,
        },
        {
          authorities_id: 2,
          menus_id: 2,
        },
        {
          authorities_id: 2,
          menus_id: 3,
        },
        {
          authorities_id: 1,
          menus_id: 4,
        },
        {
          authorities_id: 2,
          menus_id: 4,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('authority_menu_relations', null, {});
  },
};
