import express from 'express';
import mysql from 'mysql';
import moment from 'moment';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});


router.post('/submit', (req, res)=>{
  console.log(req.body);
  /**
   * Invalid Type Check
   */
  if( typeof req.body.questionNo === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1 
    });
  }
  if( typeof req.body.userNo === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1 
    });
  }
  if( typeof req.body.reportType === 'undefined'){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1 
    });
  }
  if( typeof req.body.reportDetail === 'undefined'){
    return res.status(403).json({
      error: 'Invalid type',
      code: 1 
    });
  }
  
  /**
   * Logic
   */
  const insertObject = {
    qNo: req.body.questionNo,
    mNo: req.body.userNo,
    type: req.body.reportType,
    detail: req.body.reportDetail,
    date: moment().format('YYYY-MM-DD')
  };
  const conditions = ((data)=>{
    if(typeof data !== 'object') return false;

    const fieldNames = Object.keys( data );
    let values = [];
    fieldNames.map((field, index)=>{
      values.push( data[field] );
    });
    return [fieldNames, values];
  })(insertObject);

  const insert = `INSERT INTO report ( ${conditions[0]} )  VALUES ( ? ) ;`
  try{
    conn.query(insert, [conditions[1]], (error, inserted)=>{
      if(error) throw error;
      // 여기에 추가 적으로 
      // insert 실패했을때 결과 출력시켜야됨.
      if( inserted.affectedRows === 0){
        return res.status(403).json({
          error: 'Failed insert',
          code: 2
        });
      }
      return res.status(200).json({
        success: true
      });
    });
  } catch(e){
    console.log('[report insert exception]', e);
    return res.status(500).json({
      error: 'Exceoption error',
      code: 444
    });
  }
});

export default router;