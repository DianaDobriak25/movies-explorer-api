const router = require('express').Router();
const authRouter = require('./authorization');
const userRouter = require('./user');
const movieRouter = require('./movie');

const auth = require('../middleware/auth');

router.use('/', authRouter);
router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

module.exports = router;
