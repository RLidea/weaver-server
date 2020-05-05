const user = Model => {
  return {
    model: Model,
    attributes: ['name', 'email', 'profile_thumbnail_url'],
  };
};

module.exports = {
  user,
};
