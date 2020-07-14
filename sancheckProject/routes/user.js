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
passport.use(new KakaoStrategy({
    clientID: secret_config.federation.kakao.client_id,
    callbackURL: secret_config.federation.kakao.callback_url
  },
  function (accessToken, refreshToken, profile, done) {
    const _profile = profile._json;
    console.log('Kakao login info');
    console.info(_profile);
    // todo 유저 정보와 done을 공통 함수에 던지고 해당 함수에서 공통으로 회원가입 절차를 진행할 수 있도록 한다.
    
    loginByThirdparty({
      'auth_type': 'kakao',
      'auth_id': _profile.id,
      'auth_name': _profile.properties.nickname,
      'auth_email': _profile.id
    }, done);
  }
));

// kakao 로그인
router.get('/auth/login/kakao',
  passport.authenticate('kakao')
);
// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

module.exports = router;