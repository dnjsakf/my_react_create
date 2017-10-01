import express from 'express';
const compiler = require('./compiler.js');

const router = express.Router();

/**
 * Save Source Code
 */
router.post('/save/sourceCode/:language', (req, res)=>{
  let User = req.session.user;

  /** 잘못된 접근 */
  if( typeof req.params.language === 'undefined' ){
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }
  if( typeof User === 'undefined'){
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }
  /** 잘못된 값 */
  if( typeof req.body.questionNo === 'undefined' ){
    return res.status(403).json({
      error: 'Type Error: Type of questionNo is undefined',
      code: 403
    });
  }
  if( typeof req.body.sourceCode !== 'string'){
    return res.status(403).json({
      error: 'Type Error: Type of sourceCode is only string',
      code: 403
    });
  }
  const option = {
    folderName: User.displayName,
    compiler: req.params.language,
    source: req.body.sourceCode
  }
  compiler.saveSource( option )
  .then((savedpath)=>{
    res.status(200).json({
      success: true
    });
  })
  .catch((error)=>{
    res.status(500).json({
      error: error,
      code: 500
    });
  });
});



router.post('/:language/:questionNo', (req, res)=>{
  let User = req.session.user;
  /**
   * Valid Check
   */
  if( typeof User === 'undefined'){
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }

  if( typeof req.params.language === 'undefined' ){
    return res.status(403).json({
      error: 'Type Error: Type of language is undefined',
      code: 403
    });
  }
  if( typeof req.params.questionNo === 'undefined' ){
    return res.status(403).json({
      error: 'Type Error: Type of questionNo is undefined',
      code: 403
    });
  }
  if( typeof req.body.sourceCode === 'undefined' ){
    return res.status(403).json({
      error: 'Type Error: Type of sourceCode is undefined',
      code: 403
    });
  }

  const option = {
    questionNo: req.params.questionNo,
    userNo: User.no,
    folderName: User.displayName,
    compiler: req.params.language,
    source: req.body.sourceCode
  }
  
   /* 1. 소스코드 저장 */
   console.log( '[CHECK]\n', option );
  compiler.saveSource( option )
  .then(   /* 2. 테스트케이스 가져오기 */
    compiler.getTestcase,
    (error)=>{
      console.log('[테스트케이스 가져오기 실패]\n', error);
      throw error;  
  })
  .catch((error)=>{
    throw error;
  })
  .then(  /* 3. 컴파일러 생성 */
    compiler.createCompiler,
    (error)=>{ 
      console.log('[컴파일러 생성 실패]\n', error);
      throw error;
  })
  .catch((error)=>{
    throw error;
  })
  .then(  /* 4-1. 컴파일 실행 */
    compiler.run,
    (error)=>{ 
      console.log('[컴파일 실행 실패]\n', error);
      throw error;
  })
  .catch((error)=>{
    throw error;
  })
  .then(  /* 5. 컴파일 결과 저장 */
    compiler.saveCompileResult,
    (error)=>{
      console.log('[결과 저장 실패]\n', error);
      throw error;
  })
  .catch((error)=>{
    throw error;
  })
  .then((result)=>{
    console.log( '[컴파일 성공]\n', result.process);
    res.status(200).json({
      success: true,
      result: result.process
    })
  },(error)=>{
    console.log('[보내기 실패]\n', error);
    throw error;
  })
  .catch((error)=>{                 /* 컴파일 최종 실패 */
    console.log( '[최종 에러]', JSON.parse(JSON.stringify(error)) );
    res.status(200).json({
      success: false,
      result: error
    });
  });
});

export default router;

