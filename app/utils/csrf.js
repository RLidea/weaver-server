module.exports.token = req => {
  let csrfToken;
  try {
    csrfToken = req.csrfToken();
  } catch (e) {
    // Do Nothing
  }

  return csrfToken;
};
