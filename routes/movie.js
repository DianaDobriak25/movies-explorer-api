const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL } = require('../utils/custom-validator');

// файл маршрутов

// возвращает все сохранённые текущим пользователем фильмы
const { movieFind } = require('../controllers/movie');

router.get('/', movieFind);

// создаёт фильм
const { movieCreate } = require('../controllers/movie');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(true),
    director: Joi.string().min(2).max(30).required(true),
    duration: Joi.number().required(true),
    year: Joi.string().required(true),
    description: Joi.string().required(true),
    image: Joi.string().required(true).custom(validateURL),
    trailer: Joi.string().required(true).custom(validateURL),
    nameRU: Joi.string().required(true),
    nameEN: Joi.string().required(true),
    thumbnail: Joi.string().required(true).custom(validateURL),
    movieId: Joi.string().hex().length(24).required(true),
  }),
}), movieCreate);

// удаляет сохранённый фильм по id
const { movieDeleteById } = require('../controllers/movie');

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), movieDeleteById);

module.exports = router;
