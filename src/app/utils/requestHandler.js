const handler = {};

handler.getJwt = req => {
  const token = req.cookies.jwt;
  if (token === undefined) return null;
  return token;
};

handler.getApiVersion = req => {
  const version = req.cookies.api_version;
  if (version === undefined) return null;
  return String(version);
};

module.exports = handler;
