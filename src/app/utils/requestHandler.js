const getJwt = req => {
  return req.cookies.jwt;
};

module.exports = {
  getJwt,
};
