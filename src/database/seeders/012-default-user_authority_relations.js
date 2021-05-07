module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'userAuthorityRelations',
      [
        {
          usersId: 1,
          authoritiesId: 1,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('userAuthorityRelations', null, {});
  },
};
