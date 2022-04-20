const BadRequestError = require('../errors/bad-request-error');

const celebreteErrors = (err, req, res, next) => {
  if (err.message === 'Validation failed') {
    next(new BadRequestError([...err.details.values()].map((el) => el.details).flat().map((el) => el.message).join(', ')));
  } else {
    next(err);
  }
};

module.exports = celebreteErrors;
