const Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  uuid: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true,
  },
  fk: (tableName, comment) => {
    return {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: {
          tableName,
        },
        key: 'id',
      },
      comment,
    };
  },
  nullableFk: (tableName, comment) => {
    return {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName,
        },
        key: 'id',
      },
      comment,
    };
  },
  parentId: (tableName, comment) => {
    return {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName,
        },
        key: 'id',
      },
      comment,
    };
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW()'),
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('NOW()'),
  },
  deletedAt: {
    type: Sequelize.DATE,
    allowNull: true,
  },
};
