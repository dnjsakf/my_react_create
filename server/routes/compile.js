import express from 'express';
import mysql from 'mysql';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});

router.get('/python/:question', (req, res)=>{
  
  return res.status(200).json({
    success: true,
    data: 'complete compile'
  });
});

export default router
