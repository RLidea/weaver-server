'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: 1,
          email: 'dev@weaver.com',
          password:
            '4de4ecd2289c87cdb1868312c1f967bf855ba56152d9378dc3fbd3d498739d4ace13bce9d0ec896524d67ae593b532fbb018b90408a8bc770297fc1db238757b', // secret
          name: 'Master Developer',
          salt: '1341230744792',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
