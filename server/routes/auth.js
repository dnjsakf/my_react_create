import exporess from 'express';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';

// default: auth
const router = exporess.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(()=>{
  console.log('[mysql-connection] - /api/auth');
});

/**
 * 세션검사 이벤트
 */
router.post('/session', (req, res)=>{
  const session = req.session;
  console.log('[session-check]', session.user);

  if( typeof session.user == 'undefined' ){
    return res.status(400).json({
      success: false,
      error: 'Not found user session',
      code: 1,
    });
  } 
  
  return res.status(200).json({
    user: session.user
  });
});


/**
 *  로그인 이벤트 
 */
router.post('/login', (req, res)=>{
  const session = req.session;
  const condition = {
    email: req.body.username,
    password: req.body.password,
    name: 'get',
    date: 'get'
  }
  const fields = Object.keys(condition);
  const findUser = `SELECT ${fields} FROM member WHERE email = ?`;

  conn.query( findUser, [ condition.email ], ( error, exist )=>{
    if( error ) throw error;
    if( exist.length === 0 ){
      return res.status(404).json({
        error: 'Not found user',
        code: 0,
      });
    }

    /* password hashed */
    if( bcrypt.compareSync(condition.password, exist[0].password) === false ){
      return res.status(400).json({
        error: 'Invalid password',
        code: 1
      });
    }
    session.user = {
      username: exist[0].email,
      displayName: exist[0].name,
      regDate: exist[0].date,
      /**
       * 기타 옵션들은
       * 추후에 필요할 때 추가하도록 하자. 
       */
    }
    console.log('[session-check-login]', session.user);
    return res.status(200).json({
      success: true
    })
  });
});

/**
 * 로그아웃이벤트
 */
router.post('/logout', (req, res)=>{
  let session = req.session;
  console.log('[session-check-logout]', session.user);
  if(typeof session.user !== 'undeinfed'){
    session.destroy((error)=>{
      return res.status(200).json({
        success: true
      });
    });
  } else {
    return res.status(400).json({
      error: 'undefined session',
      code: 1
    })
  }
});

/**
 * 회원가입이벤트
 */
router.post('/register', (req, res)=>{
  const condition = {
    email: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.displayName,
  };
  console.log( '[register]', condition );
  
  const maps = mapping( condition );
  const fields = maps[0];
  const values = maps[1];

  const selectUser = 'SELECT no FROM member WHERE email = ?';
  conn.query(selectUser, [ condition.email ], (error, exist)=>{
    if(error) throw error;
    if( exist.length > 0){
      return res.status(403).json({
        error: `${condition.email} is using by other`,
        code: 3
      });
    }
    const insertUser = `INSERT INTO member (${fields})  VALUES ? `;  
    conn.query(insertUser, [ [values] ], ( error, result )=>{
      if( error ) throw error;
      if( result.length === 0){
        return res.status(400).json({
          error: 'Register Error',
          code: 2
        });
      }
      return res.status(200).json({
        success: true,
      })
    });
  });
});

/**
 * 비밀번호 체크 (MyPage)
 */
router.post('/passwordCheck', (req, res)=>{

  console.log( req.body );
  const findUser = `SELECT password FROM member WHERE email = ?`;
  conn.query(findUser, [req.body.username], (error, exist)=>{
    if(error) throw error;
    if( exist.length === 0){
      return res.status(404).json({
        failure: false,
        error: 'Not found user',
        code: 1
      });
    }

    const passwordMatched = bcrypt.compareSync( req.body.password, exist[0].password);
    if( !passwordMatched ){
      return res.status(400).json({
        failure: false,
        error: 'No matched password',
        code: 2
      });
    } else {
      return res.status(200).json({
        success: true,
      })
    }
  });
});



function mapping(myObject){
  let _values = [];
  const _fields = Object.keys(myObject);

  _fields.map((el)=>{ 
    _values.push(myObject[el]);
  });
  return [_fields, _values];
}

export default router;