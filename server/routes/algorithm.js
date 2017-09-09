import express from 'express';
import mysql from  'mysql';
import myQuery from './../config/database/query';

const router = express.Router();

// Connect Database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(function(){
  console.log('[mysql-connected] - algorithm');
});

/**
 * Get Algorithm List
 * 
 * 이거 param 안꼬이게 수정해줘야됨
 */
router.get('/algorithm/:type', (req, res)=>{
  if( typeof req.params.type === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid connection', 
      code: 403
    });
  }

  switch( req.params.type ){
    // 전체 알고리즘
    case 'list':
      const listQuery = `SELECT no, subject FROM questions`;
      conn.query(listQuery, (error, subjects)=>{
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
      break;
    // 내 알고리즘  
    case 'myalgo':
      if( typeof req.session.user === 'undefined' ){
        return res.status(500).json({
          error: 'Invalid user',
          code: 500
        });
      }
      const findSolvedNumber = `SELECT DISTINCT qNo FROM qState WHERE mNo = ?`;
      conn.query(findSolvedNumber, [ req.session.user.no ], (error, exists)=>{
        if(error) throw error;
        if( exists.length === 0 ){
          return res.status(404).json({
            error: 'Not Found List',
            code: 404
          });
        }

        const inners = ((arr)=>{
          let _in = [];
          arr.map((obj, index)=>{
            _in.push(arr[index].qNo);
          });
          return _in;
        })(exists);

        const findSolvedContent = `SELECT no, subject FROM questions WHERE no IN ( ? )`;
        conn.query(findSolvedContent, [inners], (error, subjects)=>{
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
      break;

    default:
      return res.status(403).json({
        error: 'Invalid connection',
        code: 403
      });
  }
  
  
});

/**
 * Get Algorithm Detail Data
 */
router.get('/algorithm/data/:questionNo', (req, res)=>{
  console.log('[GetAlgorithmData]', req.params.questionNo);
  if( typeof req.params.questionNo === 'undefined' ){
    return res.status(403).json({
      error: "Invalid connection",
      code: 1
    });
  }
  const sql = `SELECT * FROM questions WHERE no = ? `;
  conn.query(sql, [req.params.questionNo] ,(error, question)=>{
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
 * Get Algorithm state for "Dashboard"
 */
router.get('/dashboard/state', (req, res)=>{
  /**
   * Check Validation
   */
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
  if( typeof req.query.page === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid page',
      code: 1
    });
  }
  if( typeof req.query.count === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid count',
      code: 1
    });
  }
  if( typeof req.query.sort === 'undefined' ){
    return res.status(403).json({
      error: 'Invalid sort',
      code: 1
    });
  }

  /**
   * Start Query
   */
  const mode = req.query.dashboard; // perfect, language, challenger(=all), 
  const tables = {
    main: 'qState',
    join: ['member', 'questions']
  };
  const conditions = {
    qNo: parseInt(req.query.questionNo),
    page: parseInt(req.query.page),
    count: parseInt(req.query.count)
  }
  const sort = req.query.sort;
  try{
    /**
     * 1. Query: Get Dashboard List
     */
    const dashboardRecords = myQuery.dashboard(mode, tables, conditions, sort);
    conn.query( dashboardRecords, (error, exist)=>{
      if( error ) throw error;
      if( exist.length === 0 ){
        return res.status(404).json({
          error: 'Not found data',
          code: 2
        });
      }
      // 이거 왜 저장했지??
      req.session.question = { state: exist }

      /**
       * 2. Query: Get Dashboard Some-Field Total Count
       */
      const countOption = {
        qNo: parseInt(req.query.questionNo),
        language: mode
      }
      try{
        const recordCount = myQuery.count( 'qState', 'qNo', countOption );
        conn.query(recordCount, (error, result)=>{
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
  } catch(eexception){
    console.log('[exception]', exception);
    return res.status(500).json({
      error: 'mySql query error',
      code: 500
    });
  }
});

export default router;
