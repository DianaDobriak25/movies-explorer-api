// получаем модуль Express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const apiLimiter = require('./rate-limiter');
const errorHandler = require('./middleware/error-handler');
const auth = require('./middleware/auth');
const { PORT } = require('./config');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { authRoutes, userRoutes, movieRoutes } = require('./routes');

// создаем приложение
const app = express();
// подключаемся к серверу mongo(БД)
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
app.use('/', authRoutes);
app.use('/user', auth, userRoutes);
app.use('/movie', auth, movieRoutes);

app.use(errorLogger); // подключаем логгер ошибок
// Он принимает на вход два аргумента: строку с запросом;
// колбэк, предписывающий, что нужно делать, если такой запрос пришёл на сервер.

app.use(errorHandler);
// начинаем прослушивание подключений на 3000 порту
app.listen(PORT);
