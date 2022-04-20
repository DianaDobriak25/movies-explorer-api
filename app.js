// получаем модуль Express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const apiLimiter = require('./rate-limiter');
const errorHandler = require('./middleware/error-handler');
const { PORT, DB_ADDRESS } = require('./config');
const { requestLogger, errorLogger } = require('./middleware/logger');
const celebreteErrors = require('./middleware/celebrete-errors');
const NotFoundError = require('./errors/not-found-error');

// создаем приложение
const app = express();

// Модуль Helmet csp помогает устанавливать политику безопасности контента
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}));
// подключаемся к серверу mongo(БД)
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(apiLimiter);

// мидлвэр body-parser. Он самостоятельно объединяет все пакеты
app.use(bodyParser.json());

// подключение роутера к базе данных, чтобы можно было
// взаимодействовать через API.

app.use('/api/', require('./routes'));

// проверка на несуществующий роут
app.use('*', (req, res, next) => {
  next(new NotFoundError('Данный адрес несуществует'));
});

// Он принимает на вход два аргумента: строку с запросом;
// колбэк, предписывающий, что нужно делать, если такой запрос пришёл на сервер.
app.use(errorLogger); // подключаем логгер ошибок
app.use(celebreteErrors);
app.use(errorHandler);
// начинаем прослушивание подключений на 3000 порту
app.listen(PORT);
