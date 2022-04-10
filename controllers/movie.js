const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-error');

// GET. возвращает все сохранённые текущим пользователем фильмы
module.exports.movieFind = (req, res, next) => {
  Movie.find({
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

// POST. создаёт фильм с переданными в теле:
module.exports.movieCreate = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  // получим из объекта запроса данные
  // создаем документ в коллекцию БД
  Movie.create({
    owner: req.user._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    // вернём записанные в базу данные
    .then((movie) => res.send({ data: movie }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      // Если произошла ошибка валидации при создании фильма
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err); // иначе будет выведена ошибка 500
      }
    });
};

// Delete. удаляет сохранённый фильм по id
module.exports.movieDeleteById = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(() => new NotFoundError('Нет фильма по заданному id'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нельзя удалить фильм'));
      }
      return movie.remove()
        .then(() => res.send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      // Если произошла ошибка валидации при удалении фильма
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный формат данных'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err); // иначе будет выведена ошибка 500
      }
    });
};
