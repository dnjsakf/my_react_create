'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _passportFacebook2 = _interopRequireDefault(_passportFacebook);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var StrategyFacebook = _passportFacebook2.default.Strategy;
var StrategyLocal = _passportLocal2.default.Strategy;

var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});
conn.connect(function (error) {
  if (error) throw error;
  console.log('[mysql-connection] - passport');
});

_passport2.default.serializeUser(function (user, done) {
  if (user.emails[0].value) {
    return done(null, user); // <- 세션에 user 저장: req.session.passport.user
  } else {
    return done('NOT FOUND USER');
  }
});
_passport2.default.deserializeUser(function (user, done) {
  // CHECK INSTANCE
  var USER = 'SELECT * FROM member WHERE email = "' + user.email + '"';
  conn.query(USER, function (error, exist) {
    if (error) {
      return done(error);
    }
    if (exist.length === 0) {
      return done('[NOT FOUND USER]');
    }
    return done(null, exist[0]); // <- serializeUser에서 보내준 user를 비교하는 단계?
  });
});

_passport2.default.use(new StrategyFacebook(
// Authorization to FACEBOOK DEVELOPER
{
  clientID: '1905196089750902',
  clientSecret: '4f7aad86aaf1244414aa6302a778bb6f',
  callbackURL: "/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails']
  // profileFields:['id', 'photos', 'gender','link','locale','name','timezone','updated_time', 'verified','displayName', 'email']
},
// 사용자 데이터를 가져옴
function (accessToken, refreshToken, profile, done) {
  /**
   * 1. 페이스북 사용자가 이메일이 있는지 체크
   * 2. 이메일이 있다면, member 테이블에서 이메일 탐색
   * 3. 이메일이 없다면, 이메일을 입력하도록 해야되나?  ( 대안필요 )
   * 
   * 쿼리가 세번이나 들어가는데 문제가 없을까? 어짜피 최초 1회만 이렇게 하긴 하지만...
   */

  // tester 
  console.log('[facebook]', profile);

  if (typeof profile.emails[0].value === 'undefined') {
    return done('NOT FOUND USER EMAIL'); // to callback
  } else {
    var USER = 'SELECT * FROM member WHERE email = "' + email + '"';
    conn.query(USER, function (error, exist) {
      if (error) {
        return done(error);
      }
      if (exist.length === 0) {
        // 가입
        var regInfo = [profile.emails[0].value, _bcryptjs2.default.hashSync('bs_fb_user', 8), profile.displayName];
        var REGISTER = 'INSERT INTO member(email, password, name) values ?';
        conn.query(REGISTER, function (error, result) {
          if (error) {
            return done(error);
          }
          // 다시 탐색해서 데이터 가져와야됨?? 헐?
          var USER = 'SELECT * FROM member WHERE email = "' + email + '"';
          conn.query(USER, function (error, exist) {
            if (error) {
              return done(error);
            }
            return done(null, exist[0]);
          });
        });
      } else {
        //로그인
        return done(null, exist[0]); // to path:'/auth/faceboock' -> 'serializeUser'
      }
    });
  }
}));

_passport2.default.use(new StrategyLocal(function (email, password, done) {
  /**
   * TODO
   * MEMBER TABLE CHECK
   */
  var USER = 'SELECT * FROM member WHERE email = "' + email + '"';
  conn.query(USER, function (error, exist) {
    if (error) {
      return done(error);
    } // to callback
    if (exist.length === 0) {
      return done(null, false, { message: 'Incurrect EMAIL' }); // to 
    }
    // 비밀번호 확인
    if (_bcryptjs2.default.compareSync(password, exist[0].password)) {
      return done(null, exist[0]); // to path:'/auth/login' -> 'serializeUser'
    }

    return done(null, false, { message: 'Incurrect PASSWORD' });
  });
}));

// path-get: /auth/facebook
router.get('/facebook', _passport2.default.authenticate('facebook', {
  scope: ['email']
}));
// path-get: /auth/facebook/callback
router.get('/facebook/callback', _passport2.default.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
// path-post: /auth/login
router.post('/login', function (req, res, next) {
  _passport2.default.authenticate('local', function (error, user, info) {
    // <- done(error, user, custom_error)
    // error
    if (error) {
      return next(error);
    }
    // failure
    if (!user) {
      return res.redirect('/login?message=' + info.message);
    }
    // success
    return res.redirect('/');
  })(req, res, next);
});

exports.default = router;

/**
 * Incurrect User Handler
router.get('/facebook/callback', (req, res, next)=>{
  passport.authenticate('facebook', (error, user, info)=>{ // <- done(error, user, custom_error)
    // ERROR
    if( error ) return next(error);
    // FAILURE
    if( !user ) return res.redirect(`/login?message=${info.message}`);
    // SUCCESS
    return res.redirect('/');
  })(req, res, next);
});
 */