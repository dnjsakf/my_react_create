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

router.post('/logout', (req, res)=>{
  let session = req.session;
  console.log(session);
  if(typeof session !== 'undeinfed'){
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

router.post('/login', (req, res)=>{
  const session = req.session;
  const condition = {
    email: req.body.username,
    password: req.body.password,
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

    session.username = exist[0].email;
    session.displayName = exist[0].name;

    return res.status(200).json({
      success: true
    })
  });
});


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


function mapping(myObject){
  let _values = [];
  const _fields = Object.keys(myObject);

  _fields.map((el)=>{ 
    _values.push(myObject[el]);
  });
  return [_fields, _values];
}

export default router;