const configValidation = (envObjs, options) => {
  const keys = Object.keys(envObjs);
  const messages = [];
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const message = check(envObjs[keys[i]], options);
    if (message.length !== 0) {
      messages.push(check(envObjs[keys[i]], options));
    }
  }
  let isProblem = 0;
  messages.forEach(v => { isProblem += v.length; });
  if (isProblem) {
    global.logger.system('⛔️ ️Environment Values has some problems');
    global.logger.devError(messages);
    return false;
  }
  return global.logger.system('✅ Environment Values All Cleared');
};

const check = (obj, options) => {
  const keys = Object.keys(obj);
  const messages = [];
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    if (!options?.not_required.includes(key)) {
      if (obj[key] === undefined) {
        messages.push(`${key} is undefined`);
      }
      if (typeof obj[key] === 'string' && obj[key] === '') {
        messages.push(`${key} is empty`);
      }
      if (typeof obj[key] === 'object' && obj[key]?.required === true) {
        messages.push(`${key} is empty`);
      }
    }
  }
  return messages;
};

module.exports = configValidation;
