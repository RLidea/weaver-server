const handler = {};

handler.success = (res, message, data) => {
  return res.json({
    error: false,
    message,
    data,
  });
};

handler.failed = (res, message, error) => {
  return res.json({
    error: true,
    message,
    data: {
      error: error && '',
    },
  });
};

module.exports = handler;
