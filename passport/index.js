// 로그인 기능이 기본

const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.find({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
};


// const local = require('./localStrategy');
// // const kakao = require('./kakaoStrategy');
// const { User } = require('../models');

// module.exports = (passport) => {
//   passport.serializeUser((user, done) => { // req.session 객체에 어떤 데이터를 저장할지 선택
//     // 매개변수로 user을 받아 done 함수에 두번째 인자로 user.id를 넘기고 있다.
//     // 세션에 user 정보를 모두 저장하면 용량이 커지므로, id만 저장
//     done(null, user.id); // 첫 번째 인자는 에러 발생시 사용 
//   });

//   passport.deserializeUser((id, done) => { // 매 요청 시 실행됨. 
//     // passport.session() 미들웨어가 이 메서드를 호출
//     // serializeUser이 session에 저장해 놓은 user id를 받아 user을 찾는다.
//     User.find({ where: { id } })
//       .then(user => done(null, user))
//       // 조회한 정보를 req.user에 저장하므로 req.user을 통해 로그인한 사용자 정보를 가져올 수 있음.
//       .catch(err => done(err));
//   });

//   local(passport);
//   kakao(passport);
// };