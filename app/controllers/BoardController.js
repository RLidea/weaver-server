const Model = require('./../models');

const BoardModel = Model.board;

module.exports.boardList = async () => {
  const boards = await BoardModel.findAll({
    where: {
      is_use: true,
    },
  });
  return boards;
};
