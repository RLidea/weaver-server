const user = Model => {
  return {
    model: Model,
    attributes: ['name', 'email', 'profileThumbnailUrl'],
  };
};

module.exports = {
  user,
};
