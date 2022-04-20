const { Joi } = require('celebrate');
const { validateURL } = require('./custom-validator');

const SIGNUP_SCHEMA = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(true),
  email: Joi.string().required(true).lowercase().email(),
  password: Joi.string().required(true),
});

const SIGNIN_SCHEMA = Joi.object().keys({
  email: Joi.string().required(true).lowercase().email(),
  password: Joi.string().required(true),
});

const USERS_GET_ME_SCHEMA = Joi.object().keys({
  email: Joi.string().min(2).max(30).required(true)
    .lowercase()
    .email(),
  name: Joi.string().min(2).max(30).required(true),
});

const USERS_PATCH_ME_SCHEMA = Joi.object().keys({
  email: Joi.string().min(2).max(30).required(true)
    .lowercase()
    .email(),
  name: Joi.string().min(2).max(30).required(true),
});

const MOVIES_CREATE_SCHEMA = Joi.object().keys({
  country: Joi.string().min(2).max(30).required(true),
  director: Joi.string().min(2).max(30).required(true),
  duration: Joi.number().required(true),
  year: Joi.string().required(true),
  description: Joi.string().required(true),
  image: Joi.string().required(true).custom(validateURL),
  trailerLink: Joi.string().required(true).custom(validateURL),
  nameRU: Joi.string().required(true),
  nameEN: Joi.string().required(true),
  thumbnail: Joi.string().required(true).custom(validateURL),
  movieId: Joi.number().required(true),
});

const MOVIES_DELETE_SCHEMA = Joi.object().keys({
  id: Joi.string().length(24).hex(),
});

module.exports = {
  SIGNUP_SCHEMA,
  SIGNIN_SCHEMA,
  USERS_GET_ME_SCHEMA,
  USERS_PATCH_ME_SCHEMA,
  MOVIES_CREATE_SCHEMA,
  MOVIES_DELETE_SCHEMA,
};
