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

module.exports = handler;
