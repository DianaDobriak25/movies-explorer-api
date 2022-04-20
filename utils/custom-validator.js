const validator = require('validator');
// Регулярное выражение  должно находить url разных форматов.
// Лучше использовать кастомный валидатор Joi custom.
const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

module.exports = {
  validateURL,
};
