'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'group_codes',
      [
        {
          id: 1,
          name: 'system_config',
          description: 'System config',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('group_codes', null, {});
  },
};
