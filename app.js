const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); // passport
require('dotenv').config();
const logger = require('./logger');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const { sequelize } = require('./models');
const passportConfig = require('./passport') // passport
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads'))); // related img upload, multer
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};
if (process.env.NODE_ENV === 'production') {
  sessionOption.proxy = true;
}
app.use(session(sessionOption));

app.use(flash());
app.use(passport.initialize()); // request에 passport를 심는다.
app.use(passport.session()); // req.session에 passport정보를 저장한다.

app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});

// const express = require('express');
// const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
// const path = require('path');
// const session = require('express-session');
// const flash = require('connect-flash');
// var expressLayout = require('express-ejs-layouts');
// require('dotenv').config();

// const pageRouter = require('./routes/page');

// const app = express();

// // express-ejs-layout settings
// app.set('layout', 'layout');
// app.set("layout extractScripts", true);
// app.use(expressLayout);

// // views directory & ejs setting
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.set('port', process.env.PORT || 8001);

// // middleware => ex) app.use()
// app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({ // session settings
//   resave: false, // session에 변경사항이 없더라도 저장할지에 대한 설정
//   saveUninitialized: false,// 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
//   secret: process.env.COOKIE_SECRET, // cookieParser와 동일 한 값: process.env.COOKIE_SECRET
//   cookie: {
//     httpOnly: true, // 클라이언트에서 쿠키를 확인할 수 없도록 설정
//     secure: false, // https를 적용 했을 때, true로 바꿔줘야 함
//   },
// }));
// app.use(flash());

// app.use('/', pageRouter);

// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   res.status(err.status || 500);
//   res.render('error');
// });

// app.listen(app.get('port'), () => {
//   console.log(app.get('port'), '번 포트에서 대기중');
// });