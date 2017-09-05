import express from 'express';
import mysql from  'mysql';

const router = express.Router();

// Connect Database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(function(){
  console.log('[mysql-connected]');
});

router.get('/algorithm/list', (req, res)=>{
  console.log('[GetAlgorithmList]');
  const sql = `SELECT no, subject FROM questions`;
  conn.query(sql, (error, subjects)=>{
    if(error) throw error;
    if(subjects.length === 0){
      return res.status(404).json({
        success: false,
        error: 'NOT FOUND',
        code: 0
      });
    }
    return res.status(200).json({
      success: true,
      subjects
    });
  });
});

router.get('/algorithm/data/:questionNo', (req, res)=>{
  console.log('[GetAlgorithmData]', req.params.questionNo);
  const questionNO = req.params.questionNo;
  const sql = `SELECT * FROM questions WHERE no = ? `;
  conn.query(sql, questionNO ,(error, question)=>{
    if(error) throw error;
    if(question.lenght === 0){
      return res.status(404).json({
        error: 'Not Found',
        error: 0
      });
    }
    
    return res.status(200).json({
      success: true,
      question: question[0]
    })
  });
});


/**
 * Get Question State
 */
const columnsStore={
  qState: {
    challenger: 'challenger_count',
    perfect: 'perfect_count',
    current: 'current_persent',
    c: 'language',
    java: 'language',
    python: 'language'
  }
}
router.get('/question/state', (req, res)=>{
  if( typeof req.query.questionNo === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid Question Number',
      code: 0
    });
  }
  if( typeof req.query.dashboard === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid dashboard title',
      code: 1
    });
  }

  const questionNo = req.query.questionNo;
  const table ='qState';
  const join = ['member', 'questions'];
  const fieldNames = [
    `${table}.no as no`,
    `${join[0]}.name as name`,
    `${join[1]}.subject as subject`,
    `${table}.language as language`,
    `${table}.sourceCode as sourceCode`,
    `${table}.result as result`,
    `${table}.date as date`
  ];
  const select = joinQuery(table, join, fieldNames, questionNo);
  console.log('[get-qState-check]');
  console.log(select);
  
  try{
    conn.query( select, (error, exist)=>{
      /**
       * Failure
       */
      if( error ) throw error;
      if( exist.length === 0 ){
        return res.status(404).json({
          error: 'Not found data',
          code: 2
        });
      }

      /**
       * Success
       */
      req.session.question = { state: exist[0] }
      return res.status(200).json({
        success: true,
        question:{
          state: exist[0]
        }
      });
    });  
  } catch(e){
    console.log('[exception]', e);
    return res.status(500).json({
      error: 'mySql query error',
      code: 501
    });
  }
});

export default router;

/**
 * Join 쿼리문 이어서 만들자
 * qNo = subject
 * mNo = username
 */
function joinQuery( table, join, fieldNames, condition){
  let query = '';
  const sql = {
    select: `SELECT ${fieldNames}`,
    from: `FROM ${table}`,
    join1: `INNER JOIN ${join[0]} ON ${table}.mNo = ${join[0]}.no`,
    join2: `INNER JOIN ${join[1]} ON ${table}.qNo = ${join[1]}.no`,
    where: `WHERE ${table}.qNo = ${condition}`,
    order: `ORDER BY no DESC`,
  }
  for(let key in sql){
    if(sql[key] !== ''){
      query += (sql[key] + ' ');
    }
  }
  return query;
}