import exporess from 'express';
import mysql from 'mysql';

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

router.post('/login', (req, res)=>{
  const condition = {
    email: req.body.username,
    password: req.body.password,
  }
  const fields = Object.keys(condition).join(',');
  const sql = `SELECT ? FROM member WHERE ?`;

  conn.query( sql, [ fields, condition ], ( error, exist )=>{
    if( error ) throw error;
    if( exist.length === 0 ){
      return res.status(404).json({
        error: 'Not found user',
        code: 0,
      });
    }
    return res.status(200).json({
      success: true
    })
  });
});


router.post('/register', (req, res)=>{
  const condition = {
    email: req.body.username,
    password: req.body.password,
    name: req.body.displayName,
  }
  const fields = Object.keys(condition).join(',');
  
  const sql = `INSERT INTO member( ? ) WHERE ?`;  
  conn.query(sql, [fields, condition], ( error, result )=>{
    if( error ) throw error;
    if( result.length === 0){
      return res.status(400).json({
        error: 'Register Error',
        code: 2
      });
    }

    return res.statsu(200).json({
      success: true,
    })
  });
});


export default router;