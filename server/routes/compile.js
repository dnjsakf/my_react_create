import express from 'express';
import mysql from 'mysql';
import fs from 'fs';
import childProcess from 'child_process';
import path from 'path';
import moment from 'moment';

import { update } from './../config/database/updateStats';

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
 * Compile:JAVA
 * 1: create 'temp' folder
 * 2: insert '.java' to 'temp'
 * 3: javac
 * 4: java
 */

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

  saveSource( User.displayName, req.params.language , req.body.sourceCode)
  .then((savedpath)=>{
    User.compilePath = savedpath;
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

  saveSource( User.displayName, req.params.language , req.body.sourceCode)
  /* 1. 소스코드 저장 */
  .then((savedPath)=>{
    /* Start Query */
    console.log('[1. 소스코드저장]');
    return new Promise((resolve, reject)=>{
      const sql = `SELECT input, output FROM questions WHERE no = ${req.params.questionNo}`;
      conn.query(sql, (error, exist)=>{
        if(error) throw error;
        if( exist.length === 0){
          res.status(404).json({
            error: 'Not Found',
            code: 404
          });
        }
        /** setting testcase */
        const inputs = JSON.parse(exist[0].input);
        const outputs = JSON.parse(exist[0].output);
        let testcase = inputs.map((input, index)=>{
          return { input: input, output: outputs[index] };
        });
        resolve({
          compiler: req.params.language,
          path: savedPath,
          testcase
        });
      });
    })
  })
  .then((options)=>{
    /* 2. 컴파일러 생성 */
    console.log('[2. 컴파일러 생성]');
    return createCompiler(options);
  }, (error)=>{
    /* TODO:ERROR */
    console.error( '[CREATE COMPILER]\n', error);
    res.status(500).json({
      error,
    });
  })
  .then((compile)=>{
    /* 3. 컴파일 실행 */
    console.log('[3. 컴파일러 실행]');

    /**
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     */
    return Promise.all( runCompile(compile.compilers, compile.testcase) );
    /**
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     * 여기 에러!!!
     */
  }, (error)=>{
    /* TODO:ERROR */
    console.error( '[RUN COMPILER]\n', error);
    res.status(500).json({
      error,
    });
  })
  .then((data)=>{
    /* 4. 컴파일 결과 저장 */
    console.log('[4. 컴파일 결과 저장]');
    console.log('[compile-success]\n', data);
    let conditions = {
      qNo: req.params.questionNo,
      mNo: User.no,
      language: req.params.language,
      sourceCode: req.body.sourceCode,
      result: data[0].result,
      date: moment().format('YYYY-MM-DD')
    }
    if( data.length > 1 ){
      conditions.result = data.reduce(
        (prev, current, index)=>{
          return ( index === 1 ) ?  prev.result + current.result : prev + current.rseult;
        }
      ) / data.length
    }
    const info = ((_data)=>{
      let keys = Object.keys(_data);
      let values = [];
      keys.map((key)=>{
        values.push( _data[key] );
      });
      return {keys, values};
    })(conditions);

    const INSERT = `INSERT INTO qState ( ${info.keys.join(', ')} ) values ( ? )`;
    conn.query(INSERT, [ info.values ], (error, result)=>{
      if( error ) throw error;

      update(); // update database 'battlecode_stats'

      console.log('[STATE SAVE SUCCESS]');
      res.status(200).json({
        success: true,
        result: data
      });
    });
  }, (error)=>{
    /* TODO:ERROR */
    console.log('[COMPILE FAIL]', error);
    res.status(200).json({
      success: false,
      result: error
    });
  })
  .catch((error)=>{
    console.error('[COMPILE FAIL]\n', error);
    res.status(500).json({
      error: error,
      code: 500
    });
  });
});

export default router;

/**
 * 언어별 컴파일러 생성
 */
function createCompiler( options ){
  return new Promise((resolve, reject)=>{
    let compilers = [];
    switch( options.compiler.toLowerCase() ){
      case 'python':
        for(let index = 0; index < options.testcase.length; index++){
          const child = childProcess.spawn('python',[options.path + 'MAIN.py']);
        
          child.stdout.setEncoding("utf8");
          child.stderr.setEncoding("utf8");
  
          child.domain = `python_${index}`;
  
          compilers.push(child);
        }
        resolve( { compilers, testcase: options.testcase } );
        break;
      case 'java':
        const file = path.join( options.path, 'MAIN.java' );
        const cmdJavac = `javac ${file}`;
        childProcess.exec( cmdJavac, (error_javac)=>{
          if( error_javac ) reject( error_javac );

          for(let index = 0; index < options.testcase.length; index++){
            const child = childProcess.spawn( 'java', [options.path + 'MAIN'] );
          
            child.stdout.setEncoding("utf8");
            child.stderr.setEncoding("utf8");
    
            child.domain = `java_${index}`;
    
            compilers.push(child);
          }
          resolve( { compilers, testcase: options.testcase } );
        });
        break;
      case 'c':
        reject('C cmpile is undefined');
        break;
      default:
        reject('undefined');
        break;
    }
  });
}

/**
 * 전체 case에서 한 개씩 처리
 */
function runCompile(compilers, testcase){
  return new Promise((resolve)=>{
    console.log( compilers );
    console.log( testcase );
    const promise = compilers.map( (compiler, index)=>{
      console.log( compiler, testcase[index] );
      let test = processSingleCase(compiler, testcase[index]);
      console.log( '[Promise-Test] - ', test );
      return test
    })
    console.log('[promises]\n', promise,'\n', promise.length);
    console.log('[promises]\n', promise,'\n', promise.length);
    resolve( promise );
  });
}
/**
 * 단위 처리
 */
function processSingleCase(compiler, testcase){
  console.log( '[compiler]', compiler.domain, compiler.pid );
  return new Pormise((resolve, reject)=>{
    /* stdin */
    let result = {};
    result.input = testcase.input;
    testcase.input.map((input)=>{
      compiler.stdin.write( `${input}\n` );
    });
    compiler.stdin.end(()=>{
      console.log( '[end-stdin]', compiler.domain );
    });

    /* stdout */
    let outputs = [];
    compiler.stdout.on('data', (output)=>{
      outputs = outputs.concat( clearLastBlank( output.toString().split(/\r?\n/gm) ) );
      console.log( '[stdout]', compiler.domain, testcase.output, outputs );
    });
    
    /* stderr */
    compiler.stderr.on('data', (error)=>{
      console.log( '[stderr]', compiler.domain, error );
      reject(error);
    });
    compiler.stdout.on('end', ()=>{
      if( outputs.lenght === 0 ){
        reject('error');
      }
      result.output = outputs;
      result.result = ( outputs.filter(
        (output, index)=>{
          return output === testcase.output[index];
        }
      ).length / testcase.output.length) * 100 ;
      resolve( result );
    });
  });
}



function saveSource( username, language, source){  
  return new Promise((resolve, reject)=>{
    let extension = language.toLowerCase();
    if( extension === 'python' ){
      extension = 'py';
    }
    const savePath = path.join(__dirname, './../../data/compile', username );
    const saveFile = path.join( savePath, `MAIN.${extension}` );
    
    fs.mkdir( savePath , '0777', (error_dir)=>{
      if( error_dir.code !== 'EEXIST' ){
        console.error( '[SOURCE-DIR]\n', error_dir );
        reject( error_dir );
      }
      fs.writeFile( saveFile , source, (error_file)=>{
        if( error_file ){
          console.log( '[SOURCE-FILE]\n', error_file );
          resolve({
            success: false,
            error: error_file
          });
        }
        resolve( savePath );
      });
    });
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
