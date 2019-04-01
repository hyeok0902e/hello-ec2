const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

fs.readdir('uploads', (error) => { // readdir => 이미지 업로드 시 uploads 폴더가 없으면 폴더를 생성한다.
  if (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) { // 이미지가 서버 경로에 저장되도록 함
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // path.extname: 기존 확장자
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext); // 파일명 => 기존 이름 + 업로드 날짜 + 확장자
      // 날짜를 붙이는 이유: 파일 명의 중복을 막기 위해
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 저장 이미지 최대 용량 허용치
});

// upload 변수의 핵심 미들웨어: single, array, fields, none
//upload.single('img') => post 안에 이미지 속성 명이 img 임
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // upload.single: 이미지를 하나 씩만 업로드
  console.log(req.file); 
  // 클라이언트가 게시글 등록에 사용할 수 있도록 다시 response(응담) 해 줌
  res.json({ url: `/img/${req.file.filename}` }); // upload.single이 req.file을 생성함
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if (hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({ // Promise => 비동기를 동기식으로, 순차적으로 해시태그 생성
        where: { title: tag.slice(1).toLowerCase() }, // slice(1) => 글자의 2번째 부터 마지막 요소까지 선택
      })));
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.find({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] }); // hashtag.posts
    }
    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;