const bcrypt = require('bcrypt'); // Хеширование пароля
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const { JWT_SECRET } = require('../config');
const { BAD_REQUEST_ERROR_MESSAGE, CONFLICT_USERS_ERROR_MESSAGE, NOT_FOUND_ERROR_MESSAGE } = require('../utils/constants');

// Обработчик запроса и ошибок.
// сработает при GET-запросе, возвращает информацию о пользователе (email и имя)
module.exports.usersFindInform = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(NOT_FOUND_ERROR_MESSAGE))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else {
        next(err); // иначе будет выведена ошибка 500
      }
    });
};

// PATCH. обновляет информацию о пользователе (email и имя)
module.exports.usersUpdateInform = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new NotFoundError(NOT_FOUND_ERROR_MESSAGE))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.code === 11000) {
        next(new ConflictError(CONFLICT_USERS_ERROR_MESSAGE));
      } else {
        next(err); // иначе будет выведена ошибка 500
      }
    });
};

// POST. создаёт пользователя с переданными в теле email, password и name
module.exports.userCreate = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  // закодируем пароль
  bcrypt
    // на выходе получаем хэш
    // получим из объекта запроса email, password и name
    // создаем документ в коллекцию БД
    .hash(password, 10)
    // получаем данные от монго для User.create, если все создано, то создаем
    // статус 201 и отправляем эти данные пользователю
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        // передаем объект пользователя, предварительно заменив параметр password пустой строкой
        .then(() => res.send({
          email, name,
        })) // Object.assign({}, data)
        .catch((err) => {
          // Если произошла ошибка валидации при создании пользователя
          if (err.name === 'ValidationError') {
            next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
          } else if (err.code === 11000) {
            next(new ConflictError(CONFLICT_USERS_ERROR_MESSAGE));
          } else {
            next(err); // иначе будет выведена ошибка 500
          }
        });
    });
};

// проверка почты и пароля при аутентификации.
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      // передаем пейлоуд токена и секретный ключ подписи
      // токен будет просрочен через неделю после создания
      // openssl rand -base64 {кол-во символов} - команда терминала для получения рандомной строки
      // добавляем рандомную строку для шифрования токена
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      // вернем токен
      res.send({ token });
    })
    .catch((err) => {
      // Если произошла ошибка валидации при создании пользователя
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err); // иначе будет выведена ошибка 500
      }
    });
};
