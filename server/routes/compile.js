/**
 * TEST CODE
 */
const test_sourcecode=[
  'a, b = map( int, input().split())',
  'print( a + b );'
];
const test_testcase=[
  { // case-1 :: index 0
    input: ['1 1', '2 2'],
    output: ['2', '4']
  },
  { // case-2 :: index 1
    input: ['3 1', '5 5'],
    output: ['4', '10']
  },
  { // case-3 :: index 2
    input: ['3 2', '5 -5'],
    output: ['5', '0']
  },
  { // case-3 :: index 2
    input: ['50 50', '100 100'],
    output: ['50', '200']
  },
  { // case-3 :: index 2
    input: ['150 150', '1100 1100'],
    output: ['150', '1200']
  }
];


/**
 * 음... 테스트케이스의 수 만큼 request를 받고 reponse 해주는게 좋을까?
 * 아니면, request를 받고, 다 처리하고 reponse를 하는게 좋을까?
 * 하나씩 받는게 좋을 것 같긴한데..
 */
import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import childProcess from 'child_process';
import path from 'path';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(()=>{
  console.log('[mysql-connection] - compiler');
});


/**
 * Save Source Code
 */
router.post('/save/sourceCode/:language', (req, res)=>{
  let User = req.session.user;
  /**
   * 잘못된 접근
   */
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
  /**
   * 잘못된 값
   */
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

  /**
   * SAVE Source Code
   */
  let extension = undefined;
  switch( req.params.language.toLowerCase() ){
    case 'python':
      extension = 'py';
      break;
    case 'java':
      extension = 'java';
      break;
    case 'c':
      extension = 'c';
      break;
  }
  
  const fileName = `question_${req.body.questionNo}`;
  const localPath = path.join(__dirname, './../../data/compile/username/');
  const file = `${fileName}.${extension}`;
  const savePath = path.join( localPath, file );
  
  fs.writeFile( savePath , req.body.sourceCode, 'utf-8', (error)=>{
    /* 컴파일 정보를 세션에 저장 */
    console.log( '[SAVED SOURCECODE]' );
    console.log( User.compile );
    
    if( req.params.language.toLowerCase() === 'java' ){
      const javaClasses = path.join(localPath, 'classes');
      const javac = childProcess.spawn('javac', ['-d', javaClasses, '-encoding', 'utf-8', file], {cwd: localPath});
      /* 에러 확인용 코드 */
      // javac.stderr.setEncoding('utf8');
      // javac.stdout.setEncoding('utf8');

      // javac.stderr.on('data', (error)=>{
      //   console.log('[JAVAC STDERR]\n', error);
      // });
      // javac.on('error', ( error )=>{
      //   console.log('[JAVAC ERROR]\n', error);
      // });

      javac.on('exit', ()=>{
        console.log('[JAVAC CLEAR]\n', javac.spawnargs.join(' '));
        console.log(fs.readdirSync(javaClasses,{encoding:'utf-8'}));
        /* 상위 폴더에 저장 */
        const jarFile = `${fileName}.jar`;
        const jar = childProcess.spawn('jar',[`-cvmf`, 'manifest.txt', `../${jarFile}`, '*.class'], {cwd: javaClasses});
        /* 에러 확인용 코드 */
        // jar.stderr.setEncoding('utf8');
        // jar.stdout.setEncoding('utf8');
        
        // jar.stdout.on('data', (data)=>{
        //   console.log('[JAR STDOUT]\n', data); 
        // });
        // jar.stderr.on('data', (error)=>{
        //   console.log('[JAR STDERR]\n', error);
        // });
        // jar.on('error', (error)=>{
        //   console.log('[JAR ERROR]\n', error);
        // });
        jar.on('exit', ()=>{
          User.compile = {
            compiler: req.params.language,
            path: path.join(localPath, jarFile),
            error
          }
          console.log('[JAR END]\n', jar.spawnargs.join(' '));
          return res.status(200).json({
            success: true
          });
        });
      });
      // const command = `javac -encoding utf-8 ${file} && jar -cvmf mainfest.txt ${filename}.jar *.class`;
      // const options = ['-encoding utf-8 ']
    } else {
      User.compile = {
        compiler: req.params.language,
        path: savePath,
        error
      }
      return res.status(200).json({
        success: true
      });
    }
  });
});

/**
 * Python Compile
 * usercode: 유저별로 compile url을 부여해주기 위함
 */
// router.post('/:usercode/:language', (req, res)=>{
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

  console.log('[USER COMPILE]', User.compile);
  if( typeof User.compile === 'undefined' ){
    return res.status(400).json({
      error: 'Invalid Connection: None saved compile data',
      code: 400
    });
  }
  /** 저장된 소스코드가 없을 경우 */
  if( typeof User.compile === 'undefined' ){
    return res.status(404).json({
      error: 'Not Found: No exist user saved sourcecode',
      code: 404
    });
  }
  if( typeof req.params.questionNo === 'undefined' ){
    return res.status(403).json({
      error: 'Type Error: Type of questionNo is undefined',
      code: 403
    });
  }

  /**
   * Start Query
   */
  const sql = `SELECT input, output FROM questions WHERE no = ${req.params.questionNo}`;
  conn.query(sql, (error, exist)=>{
    if(error) throw error;
    if( exist.length === 0){
      return res.status(404).json({
        error: 'Not Found',
        code: 404
      });
    }

    /**
     * Exist Question
     * setting testcase
     */
    let testcase = [];
    const inputs = JSON.parse(exist[0].input);
    const outputs = JSON.parse(exist[0].output);
    inputs.map((input, index)=>{
      testcase.push(
        {
          input: input,
          output: outputs[index]
        }
      )
    });

    const options = {
      compiler: User.compile.compiler,
      path: User.compile.path,    // 이건 세션에 저장했다가 가져오도록 하자.
      size: testcase.length
    }
    // console.log( '[Compile env]');
    // console.log( '[questionNo ]', req.params.questionNo );
    // console.log( '[ testcase  ]\n', testcase );
    // console.log( '[ options   ]\n', options );
    
    const compilers = createCompiler(options);
    if( compilers === false ){
      return res.status(500).json({
        error: 'compiler created error',
        code: 500
      });
    }

    const result = runCompile(compilers, testcase);
    Promise.all(result)
    .then((data)=>{
      console.log('[compile-success]\n', data);
      return res.status(200).json({
        success: true,
        result: data
      });
    })
    .catch((error)=>{
      console.log('[compile-fail]\n', error);
      return res.status(200).json({
        success: false,
        result: error
      });
    });
  });
});

export default router;

/**
 * 언어별 컴파일러 생성
 */
function createCompiler( options ){
  let compilers = [];
  switch( options.compiler.toLowerCase() ){
    case 'python':
      for(let index = 0; index < options.size; index++){
        const child = childProcess.spawn('python',[options.path]);
      
        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");

        child.domain = `python_${index}`;

        compilers.push(child);
      }
      return compilers;
    case 'java':
      for(let index = 0; index < options.size; index++){
        const child = childProcess.spawn('java',['-jar', options.path]);
      
        child.stdout.setEncoding("utf8");
        child.stderr.setEncoding("utf8");

        child.domain = `java_${index}`;

        compilers.push(child);
      }
      return compilers;
    case 'c':
      return false;
    default:
      return false;
  }
}

/**
 * 전체 case에서 한 개씩 처리
 */
function runCompile(compilers, testcases){
  let promise = [];
  compilers.map( (compiler, index)=>{
    promise.push(
      new Promise((resolve, reject)=>{
        let input = testcases[index].input;
        processSingleCase(compiler, input, resolve, reject);
      })
    )
  });
  return promise;
}
/**
 * 단위 처리
 */
function processSingleCase(compiler, inputs, resolve, reject){
  console.log( '[compiler]', compiler.domain, compiler.pid );
  /**
   * stdin
   * INPUT이 여러개 여러 줄 일 수 있음
   */
  let result = {};
  result.input = inputs;
  inputs.map((input)=>{
    compiler.stdin.write( `${input}\n` );
  });
  compiler.stdin.end(()=>{
    console.log( '[end-stdin]', compiler.domain );
  });
  /**
   * stdout
   */
  compiler.stdout.on('data', (output)=>{
    let outputs = [];
    outputs = clearLastBlank(output.toString().split(/\r?\n/gm));
    console.log( '[stdout]', compiler.domain, outputs);
    result.output = outputs;
    resolve(result);
  });
  /**
   * stderr
   */
  compiler.stderr.on('data', (error)=>{
    console.log( '[stderr]', compiler.domain, error );
    reject(error);
  });
  compiler.stdout.on('end', ()=>{
    // console.log('[end]', compiler.domain );
  });
}
/**
 * split 하면 맨 뒤에 공백이 하나 추가됨 이를 제거함
 */
function clearLastBlank(arr){
  let cleared = arr;
  cleared.map((item, index)=>{
    if( item === ''){
      cleared.splice(index, 1);
    }
  });
  return cleared;
}