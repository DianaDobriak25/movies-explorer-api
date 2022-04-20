const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/unauthorized-error');
const { UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');

// мидлвэр для авторизации
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE);
  // Вырезаем Bearer из токена
  const token = authorization.replace('Bearer ', '');
  try {
    // верифицирует токен из заголовков.
    const payload = jwt.verify(token, JWT_SECRET);
    // Если с токеном всё в порядке, мидлвэр должен добавлять
    // пейлоуд токена в объект запроса и вызывать next
    req.user = payload;
  } catch (err) {
    next(new UnauthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
  }
  next();
};
module.exports = auth;
