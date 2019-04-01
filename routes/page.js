const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = router;

// const express = require('express');
// const { isLoggedIn,isNotLoggedIn } = require('./middlewares');
// const { Post, User } = require('../models');

// const router = express.Router();

// router.get('/profile', isLoggedIn, (req, res) => {
//   res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
// });

// router.get('/join', isNotLoggedIn, (req, res) => {
//   res.render('join', {
//     title: '회원가입 - NodeBird',
//     user: req.user, // 사용자 생성을 위한 새 사용자 모델 요청
//     joinError: req.flash('joinError'),
//   });
// });

// router.get('/', (req, res, next) => {
//   Post.findAll({
//     include: {
//       model: User,
//       attributes: ['id', 'nick'],
//     },
//     order: [['createdAt', 'DESC']],
//   })
//     .then((posts) => {
//       res.render('main', {
//         title: 'NodeBird',
//         twits: posts,
//         user: req.user,
//         loginError: req.flash('loginError'),
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//       next(error);
//     });
// });

// module.exports = router;