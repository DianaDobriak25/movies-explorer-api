const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" должно быть заполнено'],
    lowercase: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    select: false,
  },
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    default: 'например: Диана или Владимир',
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
});

// найти пользовательские учетные данные
function findUserByCredentials({ email, password }) {
  // Если пользователя с переданным email нет в базе,
  // обработка запроса должна переходить в блок catch.
  // Находим одного пользователя, найти email, который соответствует запросу
  // берем у него пароль - за это отвечает .select()
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      // сравниваем переданный пароль и хеш из базы
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          // если несовпадение
          if (!matched) {
            // пользователь не найден — отклоняем промис
            // с ошибкой и переходим в блок catch
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
