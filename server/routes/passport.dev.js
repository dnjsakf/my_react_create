import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';

import passport from 'passport';
import Facebook from 'passport-facebook';
import Local from 'passport-local';

const router = express.Router();
const StrategyFacebook = Facebook.Strategy;
const StrategyLocal = Local.Strategy;

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: (process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode'
});
conn.connect((error)=>{
  if( error ) throw error;
  console.log( '[mysql-connection] - passport' );
});

passport.serializeUser((user, done)=>{
  if( user.emails[0].value ){
    return done(null, user); // <- 세션에 user 저장: req.session.passport.user
  } else {
    return done('NOT FOUND USER');
  }
});
passport.deserializeUser((user,done)=>{
  // CHECK INSTANCE
  const USER = `SELECT * FROM member WHERE email = "${user.email}"`;
  conn.query(USER, (error, exist)=>{
    if( error ){ return done( error ); }
    if( exist.length === 0 ){ return done('[NOT FOUND USER]'); }
    return done( null, exist[0] ); // <- serializeUser에서 보내준 user를 비교하는 단계?
  });
});

passport.use(new StrategyFacebook(
  // Authorization to FACEBOOK DEVELOPER
  {
    clientID: '1905196089750902',
    clientSecret: '4f7aad86aaf1244414aa6302a778bb6f',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id', 'displayName', 'emails']
    // profileFields:['id', 'photos', 'gender','link','locale','name','timezone','updated_time', 'verified','displayName', 'email']
  },
  // 사용자 데이터를 가져옴
  (accessToken, refreshToken, profile, done)=>{
    /**
     * 1. 페이스북 사용자가 이메일이 있는지 체크
     * 2. 이메일이 있다면, member 테이블에서 이메일 탐색
     * 3. 이메일이 없다면, 이메일을 입력하도록 해야되나?  ( 대안필요 )
     * 
     * 쿼리가 세번이나 들어가는데 문제가 없을까? 어짜피 최초 1회만 이렇게 하긴 하지만...
     */

    // tester 
    console.log( '[facebook]', profile );

    if( typeof profile.emails[0].value === 'undefined' ){
      return done('NOT FOUND USER EMAIL'); // to callback
    } else {
      const USER = `SELECT * FROM member WHERE email = "${email}"`;
      conn.query(USER, (error, exist)=>{
        if( error ){ return done( error ); }
        if( exist.length === 0 ){
          // 가입
          const regInfo = [
            profile.emails[0].value,
            bcrypt.hashSync('bs_fb_user', 8),
            profile.displayName
          ];
          const REGISTER = `INSERT INTO member(email, password, name) values ?`;
          conn.query( REGISTER, (error, result)=>{
            if( error ){ return done(error); }
            // 다시 탐색해서 데이터 가져와야됨?? 헐?
            const USER = `SELECT * FROM member WHERE email = "${email}"`;
            conn.query(USER, (error, exist)=>{
              if( error ){ return done(error); }
              return done(null, exist[0]);
            });
          });
        } else {
          //로그인
          return done(null, exist[0]);    // to path:'/auth/faceboock' -> 'serializeUser'
        }
      });
    }
  }
));

passport.use(new StrategyLocal(
  (email, password, done)=>{
    /**
     * TODO
     * MEMBER TABLE CHECK
     */
    const USER = `SELECT * FROM member WHERE email = "${email}"`;
    conn.query(USER, (error, exist)=>{
      if( error ){ return done( error ); }  // to callback
      if( exist.length === 0 ){
        return done(null, false, {message: 'Incurrect EMAIL'}); // to 
      }
      // 비밀번호 확인
      if( bcrypt.compareSync(password, exist[0].password) ){
        return done(null, exist[0]); // to path:'/auth/login' -> 'serializeUser'
      }

      return done(null, false, {message: 'Incurrect PASSWORD'});
    });
  }
));

// path-get: /auth/facebook
router.get('/facebook', passport.authenticate(
  'facebook',
  {
    scope: ['email']
  }
));
// path-get: /auth/facebook/callback
router.get('/facebook/callback', passport.authenticate(
  'facebook',
  {
    successRedirect: '/',
    failureRedirect: '/login'
  }
));
// path-post: /auth/login
router.post('/login', (req, res, next)=>{
  passport.authenticate( 'local', (error, user, info)=>{ // <- done(error, user, custom_error)
    // error
    if( error ){ return next(error); }
    // failure
    if( !user ){ return res.redirect(`/login?message=${info.message}`); }
    // success
    return res.redirect('/');
  })(req, res, next);
});

export default router





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
