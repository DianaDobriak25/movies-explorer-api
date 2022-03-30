const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { userCreate, login } = require('../controllers/user');
// Валидация приходящих на сервер данных.
// Такой мидлвэр валидирует тело запроса.
// В нём должны быть предписанные эти поля из models
// Если тело запроса не пройдёт валидацию, контроллер userCreate вообще не запустится

// создаёт пользователя с переданными в теле
// email, password и name
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(true).lowercase().email(),
    password: Joi.string().required(true),
    name: Joi.string().min(2).max(30),
  }),
}), userCreate);

// проверяет переданные в теле почту и пароль
// и возвращает JWT
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(true).lowercase().email(),
    password: Joi.string().required(true),
  }),
}), login);

module.exports = router;
