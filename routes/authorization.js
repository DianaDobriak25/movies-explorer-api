const router = require('express').Router();
const { celebrate } = require('celebrate');
const { userCreate, login } = require('../controllers/user');
const { SIGNUP_SCHEMA, SIGNIN_SCHEMA } = require('../utils/validator-schemas');
// Валидация приходящих на сервер данных.
// Такой мидлвэр валидирует тело запроса.
// В нём должны быть предписанные эти поля из models
// Если тело запроса не пройдёт валидацию, контроллер userCreate вообще не запустится

// создаёт пользователя с переданными в теле
// email, password и name
router.post('/signup', celebrate({
  body: SIGNUP_SCHEMA,
}), userCreate);

// проверяет переданные в теле почту и пароль
// и возвращает JWT
router.post('/signin', celebrate({
  body: SIGNIN_SCHEMA,
}), login);

module.exports = router;
