const handler = {};

handler.success = (res, message, data) => {
  return res.json({
    error: false,
    message,
    data,
  });
};

handler.failed = (res, e) => {
  return res.json({
    error: true,
    message: e,
  });
};

handler.devLog = message => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV === 'development') console.log(message);
};

module.exports = handler;
