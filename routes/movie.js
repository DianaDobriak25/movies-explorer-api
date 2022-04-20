const router = require('express').Router();
const { celebrate } = require('celebrate');
const { MOVIES_CREATE_SCHEMA, MOVIES_DELETE_SCHEMA } = require('../utils/validator-schemas');

// файл маршрутов

// возвращает все сохранённые текущим пользователем фильмы
const { movieFind } = require('../controllers/movie');

router.get('/', movieFind);

// создаёт фильм
const { movieCreate } = require('../controllers/movie');

router.post('/', celebrate({
  body: MOVIES_CREATE_SCHEMA,
}), movieCreate);

// удаляет сохранённый фильм по id
const { movieDeleteById } = require('../controllers/movie');

router.delete('/:id', celebrate({
  params: MOVIES_DELETE_SCHEMA,
}), movieDeleteById);

module.exports = router;
