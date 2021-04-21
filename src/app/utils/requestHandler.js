const handler = {};

handler.getJwt = req => {
  const token = req.cookies.jwt;
  if (token === undefined) return null;
  return token;
};

module.exports = handler;
