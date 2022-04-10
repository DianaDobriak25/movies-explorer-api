// получаем модуль Express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const apiLimiter = require('./rate-limiter');
const errorHandler = require('./middleware/error-handler');
const auth = require('./middleware/auth');
const { PORT, DB_ADDRESS } = require('./config');
const { requestLogger, errorLogger } = require('./middleware/logger');
const celebreteErrors = require('./middleware/celebrete-errors');
const NotFoundError = require('./errors/not-found-error');

// создаем приложение
const app = express();
// подключаемся к серверу mongo(БД)
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errorLogger); // подключаем логгер ошибок
app.use(apiLimiter);

// мидлвэр body-parser. Он самостоятельно объединяет все пакеты
app.use(bodyParser.json());

// csp - предотвращение межсайтовых вмешательств через задание заголовка Content-Security-Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      objectSrc: ['none'],
    },
  }),
);

app.use(requestLogger); // подключаем логгер запросов

// подключение роутера к базе данных, чтобы можно было
// взаимодействовать через API.

app.use('/', require('./routes/authorization'));

app.use('/users', auth, require('./routes/user'));

app.use('/movies', auth, require('./routes/movie'));

// проверка на несуществующий роут
app.use('*', (req, res, next) => {
  next(new NotFoundError('Данный адрес несуществует'));
});

// Он принимает на вход два аргумента: строку с запросом;
// колбэк, предписывающий, что нужно делать, если такой запрос пришёл на сервер.

app.use(celebreteErrors);
app.use(errorHandler);
// начинаем прослушивание подключений на 3000 порту
app.listen(PORT);
