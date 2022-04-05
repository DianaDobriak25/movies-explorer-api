const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минуты
  max: 100, // Ограничьте каждый IP до 100 запросов на `окно " (здесь, за 15 минут)
  standardHeaders: true, // Информация о пределе скорости возврата взаголовки `RateLimit-*`
  legacyHeaders: false, // Отключите заголовки `X-RateLimit -*'
});

module.exports = apiLimiter;
