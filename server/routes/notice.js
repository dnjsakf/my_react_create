import express from 'express';
import mysql from 'mysql';
import myQuery from './../config/database/query';

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

  const count = req.query.count;
  const rows = ( req.query.page - 1 ) * count;
  const noticeRecords = `SELECT * FROM notice ORDER BY no DESC LIMIT ${rows}, ${count}`;
  try{
    conn.query(noticeRecords, (error, exist)=>{
      if(error) throw error;
      try{
        const reocrdsCount = myQuery.count('notice');
        console.log( reocrdsCount );
        conn.query( reocrdsCount, (error, result)=>{
          if(error) throw error;
  
          let nmg = result[0].count % req.query.count;
          let maxPage = parseInt( result[0].count / req.query.count );
          if( nmg > 0 ) maxPage += 1;
  
          return res.status(200).json({
            success: true,
            maxPage,
            records: exist,
          });
        });
      } catch(exception) {
        console.log('[exception]', exception);
        return res.status(500).json({
          error: 'MyQuery.count error',
          code: 500,
          exception
        });
      }
    });
  } catch(exception){
    console.error('[Exception]', exception);
    return res.status(500).json({
      error: 'MySQl noticeRecords',
      exception,
      code: 500
    });
  }

});

export default router;