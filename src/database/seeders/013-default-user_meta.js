module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'userMeta',
      [
        {
          usersId: 1,
          name: 'gender',
          key: 'gender',
          value: 'non-binary',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userMeta', null, {});
  },
};
