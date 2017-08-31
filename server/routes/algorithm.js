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

router.get('/data/algorithm/list', (req, res)=>{
  console.log('[LIST]', req.query);
  
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

router.get('/data/algorithm/data/:questionNo', (req, res)=>{
  console.log('[DATA]', req.params.questionNo, req.query);

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

export default router;