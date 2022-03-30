// получаем модуль Express
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const errorHandler = require('./middleware/error-handler');
const auth = require('./middleware/auth');
const { PORT } = require('./config');
const { requestLogger, errorLogger } = require('./middleware/logger');

// создаем приложение
const app = express();
// подключаемся к серверу mongo(БД)
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// мидлвэр body-parser. Он самостоятельно объединяет все пакеты
app.use(bodyParser.json());

app.use(requestLogger); // подключаем логгер запросов

// подключение роутера к базе данных, чтобы можно было
// взаимодействовать через API.
app.use('/', require('./routes/authorization'));
app.use('/user', auth, require('./routes/user'));

app.use('/movie', auth, require('./routes/movie'));

app.use(errorLogger); // подключаем логгер ошибок
// Он принимает на вход два аргумента: строку с запросом;
// колбэк, предписывающий, что нужно делать, если такой запрос пришёл на сервер.

app.use(errorHandler);
// начинаем прослушивание подключений на 3000 порту
app.listen(PORT);
