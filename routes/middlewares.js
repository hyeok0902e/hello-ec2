exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // passport가 isAuthenticated 메서드를 request에 추가했음
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) { // passport가 isAuthenticated 메서드를 request에 추가했음
    next();
  } else {
    res.redirect('/');
  }
};