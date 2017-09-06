import express from 'express';
import mysql from 'mysql';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});

router.get('/list', (req, res)=>{
  /**
   * Invalid Check
   */
  if( typeof req.query.page === 'undeinfed'){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }
  if( typeof req.query.count === 'undeinfed'){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }

  const page = req.query.page;
  const count = req.query.count;
  const rows = ( page - 1 ) * count;
  const noticeSelect = `SELECT * FROM notice ORDER BY no DESC LIMIT ${rows}, ${count}`;
  try{
    conn.query(noticeSelect, (error, exist)=>{
      if(error) throw error;
      
      return res.status(200).json({
        success: true,
        data: exist
      });
    });
  } catch(e){
    console.error('[Exception-notice-select]', e);
    return res.status(500).json({
      error: 'Exception',
      exception: e,
      code: 444
    });
  }

});

export default router;