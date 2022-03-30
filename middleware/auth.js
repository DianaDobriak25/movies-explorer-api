const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const { JWT_SECRET } = require('../config');
const UnauthorizedError = require('../errors/unauthorized-error');

// мидлвэр для авторизации
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new UnauthorizedError('Необходима авторизация');
  // Вырезаем Bearer из токена
  const token = authorization.replace('Bearer ', '');
  try {
    // верифицирует токен из заголовков.
    const payload = jwt.verify(token, JWT_SECRET);
    // Если с токеном всё в порядке, мидлвэр должен добавлять
    // пейлоуд токена в объект запроса и вызывать next
    req.user = payload;
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  next();
};
module.exports = auth;
