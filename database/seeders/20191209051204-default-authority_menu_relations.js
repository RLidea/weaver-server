'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('authority_menu_relations', [{
      id: 1,
      authorities_id: 1,
      menus_id: 1,
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('authority_menu_relations', null, {});
  }
};
