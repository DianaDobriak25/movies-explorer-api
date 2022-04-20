const router = require('express').Router();
const { celebrate } = require('celebrate');
const { USERS_GET_ME_SCHEMA, USERS_PATCH_ME_SCHEMA } = require('../utils/validator-schemas');
// файл маршрутов

// возвращаем информацию о пользователе
const { usersFindInform } = require('../controllers/user');

router.get('/me', celebrate({
  body: USERS_GET_ME_SCHEMA,
}), usersFindInform);

// Обновляем информацию о пользователе
const { usersUpdateInform } = require('../controllers/user');

router.patch('/me', celebrate({
  body: USERS_PATCH_ME_SCHEMA,
}), usersUpdateInform);

module.exports = router;
