// импортируем нужные модули. Мы воспользуемся одним из самых
// популярных и гибких — библиотекой для логирования winston
// Чтобы с ней было удобно работать в express,
// нам понадобится мидлвэр express-winston.
const winston = require('winston');
const expressWinston = require('express-winston');

// После этого нужно создать логгер. Мы будем логировать
// два типа информации — запросы к серверу и ошибки, которые на нём происходят.
// Каждый запрос к API должен сохраняться в файле request.log.
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

// логгер ошибок
// Если API возвращает ошибку, информация о ней должна сохраняться в файле error.log.
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};

//  при запросе к серверу создастся файл request.log,
// в него в формате json запишется часть данных из запроса и ответа.
// Если на сервере произойдёт ошибка, создастся файл error.log,
// туда запишется часть данных запроса и ответа, и информация об ошибке
