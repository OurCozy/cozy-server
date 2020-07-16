const express = require('express');
const router = express.Router();
const upload = require('../modules/multer');


const UserController = require('../controllers/user');
const AuthMiddleware = require('../middlewares/auth');

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const secret_config = require('../config/secretKey');
const mysql_dbc = require('../config/database');



router.post('/signin', UserController.signin);
router.post('/signup', UserController.signup);
router.post('/uploadImage/:bookstoreIdx',upload.array('profile'),UserController.updateImages);
router.post('/findpw', UserController.findPassword);

/* 
    ✔️ update profile
    METHOD : POST
    URI : localhost:3000/user/profile
    REQUEST HEADER : JWT
    REQUEST BODY : ⭐️image file ⭐️
    RESPONSE DATA : user profile
*/
router.post('/profile', AuthMiddleware.checkToken, upload.single('profile'), UserController.updateProfile);

// kakao로 로그인
passport.use(
  "kakao-login",
  new KakaoStrategy(kakaoKey, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const NewUserId = "kakao:" + profile.id;
    const NewUserPassword = sha256.x2(NewUserId);
    //해당 id를 가진 user가 존재하는지 찾아본다.
    const sql = "select * from kakaoUser where username = ?";
    const post = [NewUserId];
    conn.query(sql, post, (err, results, fields) => {
      if (err) {
        console.log(err);
        done(err);
      }
      //만약 해당 유저가 존재하지 않는다면,
      //새로운 아이디를 하나 만들어주고 로그인을 시켜줌.
      if (results.length === 0) {
        const sql = "INSERT kakaoUser(username, password) values(?,?)";
        const post = [NewUserId, NewUserPassword];
        conn.query(sql, post, (err, results, fields) => {
          if (err) {
            console.log(err);
            done(err);
          }
          //가입이 되었다면 해당 유저로 바로 로그인시켜줌
          const sql = "SELECT * FROM kakaoUser where username =?";
          const post = [NewUserId];
          conn.query(sql, post, (err, results, fields) => {
            if (err) {
              console.log(err);
              done(err);
            }
            const user = results[0];
            return done(null, user);
          });
        });
      } else {
        //이미 유저가 존재한다면 바로 로그인시켜줌.
        const user = results[0];
        return done(null, user);
      }
    });
  })
);

// kakao 로그인
router.get('/auth/login/kakao',
  passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

module.exports = router;