const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

// файл маршрутов

// возвращаем информацию о пользователе
const { usersFindInform } = require('../controllers/user');

router.get('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required(true)
      .lowercase()
      .email(),
    name: Joi.string().min(2).max(30).required(true),
  }),
}), usersFindInform);

// Обновляем информацию о пользователе
const { usersUpdateInform } = require('../controllers/user');

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required(true)
      .lowercase()
      .email(),
    name: Joi.string().min(2).max(30).required(true),
  }),
}), usersUpdateInform);

module.exports = router;
