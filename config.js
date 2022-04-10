// jwt ключ- это некий пароль для формирования зашифрованного токена.
// Токен представляет собой уже зашифрованную строку,
// чтобы ее было сложно расшифровать, мы добавляем секрет.
const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const { DB_ADDRESS = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { PORT = '3000' } = process.env;
module.exports = {
  JWT_SECRET,
  DB_ADDRESS,
  PORT,
};
