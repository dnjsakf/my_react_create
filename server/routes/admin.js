import express from 'express';
import mysql from 'mysql';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ( process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode'
});

router.get('/stats/notice', (req, res)=>{
  const sql = 'SELECT notice FROM battlecode_stats.board';
  conn.query(sql, (error, result)=>{
    if(error) throw error;
    if( result.length === 0 ){
      return res.status(404).json({
        error: 'No search data',
        code: 1,
      });
    }
    return res.status(200).json({
      success: true,
      count: result[0].notice
    });
  });
});


export default router