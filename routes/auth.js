const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.find({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// kakao login
router.get('/kakao', passport.authenticate('kakao')); // 내부적으로 req.login을 호출하므로 콜백함수가 없음
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/', // 로그인 실패 시 이동하는 곳
}), (req, res) => {
  res.redirect('/'); // 로그인 성공 시 이동하는 곳
});

module.exports = router;

// // 회원가입, 로그인, 로그아웃 라우터

// const express = require('express');
// const passport = require('passport'); // 인증 모듈
// const bcrypt = require('bcrypt'); // 비밀번호 암호화 모듈
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 로그인 여부를 판단하는 미들웨어
// const { User } = require('../models'); // user 모델

// const router = express.Router(); // express 엔진의 Router 모델 임포트

// // 회원가입 
// router.post('/join', isNotLoggedIn, async (req, res, next) => { // isNotLoggedIn => 로그인이 안되었을 때
//   const { email, nick, password } = req.body; // json 데이터 (header와 body로 구성됨)
//   try {
//     const exUser = await User.find({ where: { email } });
//     if (exUser) {
//       req.flash('joinError', '이미 가입된 이메일입니다.');
//       return res.redirect('/join');
//     }
//     const hash = await bcrypt.hash(password, 12); // 암호화
//     await User.create({
//       email,
//       nick,
//       password: hash,
//     });
//     return res.redirect('/');
//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// });

// // 로그인
// router.post('/login', isNotLoggedIn, (req, res, next) => { // isNotLoggedIn => 로그인이 안되었을 때
//   passport.authenticate('local', (authError, user, info) => { // 'local' => passport/index.js에서 선언
//     if (authError) { // 에러 처리
//       console.error(authError);
//       return next(authError);
//     }
//     if (!user) { // 유저가 존재하지 않을 떄
//       req.flash('loginError', info.message);
//       return res.redirect('/');
//     } 
//     return req.login(user, (loginError) => { // 로그인 진행
//       if (loginError) {
//         console.error(loginError);
//         return next(loginError);
//       }
//       return res.redirect('/');
//     });
//   })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
//   // router도 미들웨어임.
// });

// // 로그아웃
// router.get('/logout', isLoggedIn, (req, res) => { // isLoggedIn => 로그인 되어 있을 때
//   req.logout();
//   req.session.destroy(); // 세션 정보 삭제
//   res.redirect('/');
// });

// router.get('/kakao', passport.authenticate('kakao'));

// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: '/',
// }), (req, res) => {
//   res.redirect('/');
// });

// module.exports = router;