module.exports = {
  development: {
    origin: true,
    credentials: true,
  },
  production: {
    origin: process.env.CLIENT_DOMAIN,
    credentials: true,
  },
};
