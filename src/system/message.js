const handler = {};

handler.success = (res, message, data) => {
  return res.status(200).json({
    error: false,
    message,
    data,
  });
};

handler.failed = (res, message, error) => {
  return res.status(202).json({
    error: true,
    message,
    data: {
      error: error && '',
    },
  });
};

module.exports = handler;
