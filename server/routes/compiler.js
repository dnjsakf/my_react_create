import childProcess from 'child_process';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql';

import { update } from './../config/database/updateStats';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ( process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode'
});
conn.connect(()=>{
  console.log('[mysql-connection] - compiler');
});

 /* 1. 유저 이름의 폴더에 소스코드 저장: promise */
export function saveSource( option ){
  return new Promise((resolve, reject)=>{
    let extension = option.compiler.toLowerCase();
    if( extension === 'python' ){
      extension = 'py';
    }
    option.savePath = path.join(__dirname, './../../data/compile', option.folderName );
    option.saveFile = path.join( option.savePath, `MAIN.${extension}` );

    /* 폴더 생성 || 기존에 폴더가 있다면 파일만 생성 */
    fs.mkdir( option.savePath , '0777', (error_dir)=>{
      /* 폴더가 이미 생성되어있음 */
      if( error_dir && error_dir.code !== 'EEXIST'){
        console.error( '[SOURCE-DIR]\n', error_dir );
        reject( error_dir );
      } else {
        /* 파일 생성 */
        fs.writeFile( option.saveFile , option.source, (error_file)=>{
          if( error_file ){
            console.log( '[SOURCE-FILE]\n', error_file );
            reject( error_file );
          }
          resolve( option );
        });
      }
    });
  });  
}

 /* 2. 테스트케이스 가져오기: promise */
export function getTestcase( option ){
  return new Promise((resolve, reject)=>{
    const sql = `SELECT input, output FROM questions WHERE no = ${option.questionNo}`;
    conn.query(sql, (error, exist)=>{
      if(error) reject(error);
      if( exist.length === 0){
        reject( 'Error: Not Found Testcase' );
      }
      /** setting testcase */
      const inputs = JSON.parse(exist[0].input);
      const outputs = JSON.parse(exist[0].output);
      option.testcase = inputs.map((input, index)=>{
        return { input: input, output: outputs[index] };
      });
      resolve( option );
    });
  })
}

/* 3. 컴파일러 생성 */
export function createCompiler( option ){
    option.compilers = [];
    switch( option.compiler.toLowerCase() ){
      case 'python':
        return new Promise((resolve, reject)=>{
          const cwd = `cd ${option.savePath}`;
          childProcess.exec( cwd, (error_cwd)=>{
            if( error_cwd ){
              console.log('[ERROR: python]\n', error_cwd);
              reject( error_cwd.message.replace(/Command failed:.+py:/g, '') );
            }
            for(let index = 0; index < option.testcase.length; index++){
              const child = childProcess.spawn('python',[ 'MAIN.py'],{ cwd:option.savePath });
            
              child.stdout.setEncoding("utf8");
              child.stderr.setEncoding("utf8");
      
              child.compilerName = `python_${index}`;
      
              option.compilers.push(child);
            }
            if( option.compilers.length === 0 ){
              reject('Error: compiler is empty');
            } else {
              resolve( option );
            }
          });
        });
        break;
      case 'java':
        return new Promise((resolve, reject)=>{
          const cmdJavac = [
            `cd ${option.savePath}`,
            `javac MAIN.java -encoding utf-8`
          ].join( ' && ');
          
          childProcess.exec( cmdJavac, (error_javac)=>{
            if( error_javac ){
              console.log('[ERROR: javac]\n', error_javac);

              reject( error_javac.message.replace(/Command failed:.+java:/g, '') );
            }
            for(let index = 0; index < option.testcase.length; index++){
              const child = childProcess.spawn( 'java', ['MAIN'], {cwd: option.savePath} );
            
              child.stdout.setEncoding("utf8");
              child.stderr.setEncoding("utf8");
      
              child.compilerName = `java_${index}`;
      
              option.compilers.push(child);
            }
            if( option.compiler.length === 0 ){
              reject('Error: compiler is empty');
            } else {
              resolve( option );
            }
          });
        });
        break;
      case 'c':
      /**
       * 1. 실행파일 생성
       *    => gcc -o [실행파일명] [실행소스코드]
       * 2. 실행파일 호출
       *    => [경로]/실행파일명.exe
       */
        return new Promise((resolve, reject)=>{
          const cmdGcc = [
            `cd ${option.savePath}`,
            `gcc -o MAIN MAIN.c`
          ].join(' && ');
          const run = ( process.platform === 'linux' ? './MAIN' : 'MAIN.exe' );

          childProcess.exec( cmdGcc, (cmdErrorGcc)=>{
            if( cmdErrorGcc ){
              console.log('[ERROR: GCC]\n', cmdErrorGcc);
              reject( cmdErrorGcc.message );
            }
            for(let index = 0; index < option.testcase.length; index++){
              const child = childProcess.spawn( run, {cwd: option.savePath} );
            
              child.stdout.setEncoding("utf8");
              child.stderr.setEncoding("utf8");
      
              child.compilerName = `c_${index}`;
      
              option.compilers.push(child);
            }
            if( option.compiler.length === 0 ){
              reject('Error: compiler is empty');
            } else {
              resolve( option );
            }
          });
        });
        break;
      default:
        return new Promise((resolve, reject)=>{
          if( true ){
            reject('Error: invalid language');
          } else {
            resolve('TODO');
          }
        });
        break;
    }
}

/* 4. 컴파일 실행 */
export function run( option ){
  return new Promise((resolve, reject)=>{
    const promises = option.compilers.map( (compiler, index)=>{
      return processSingleCase(compiler, option.testcase[index]);
    });
    if( promises.length !== 0){
      Promise.all( promises )
      .then(( result )=>{
        option.process = result;
        resolve( option );
      })
      .catch(( error )=>{
        reject( error );
      });
     } else {
      reject('error');
     }
  });
}

/* 5. 단위 처리 */
export function processSingleCase( compiler, testcase ){
  console.log( '[process compiler]', compiler.compilerName, compiler.pid, testcase);
  return new Promise((resolve, reject)=>{
    compiler.stdout.setEncoding("utf-8");
    compiler.stderr.setEncoding("utf-8");

    /* stdin */
    let result = {};
    result.input = testcase.input;
    testcase.input.map((input)=>{
      compiler.stdin.write( `${input}\n` );
    });
    compiler.stdin.end(()=>{
      console.log( '[process end-stdin]', compiler.compilerName );
    });

    /* stdout */
    let outputs = [];
    compiler.stdout.on('data', (output)=>{
      outputs = outputs.concat( clearLastBlank( output.toString().split(/\r?\n/gm) ) );
      console.log( '[process stdout]', compiler.compilerName, testcase.output, outputs );
    });
    
    /* stderr */
    compiler.stderr.on('data', (error)=>{
      console.log( '[process stderr]', compiler.compilerName, error );
      result.result = [ 0 ];
      result.error = error;
      resolve(result);
    });

    compiler.stdout.on('end', ()=>{
      result.output = outputs;
      result.result = ( outputs.filter(
        (output, index)=>{
          return output === testcase.output[index];
        }
      ).length / testcase.output.length) * 100 ;
      resolve( result );
    });
    compiler.on('error', (error)=>{
      console.log( '[compiler error]', error );
      reject( error );
    });
  });
}

export function saveCompileResult( option ){
  return new Promise((resolve, reject)=>{
    let conditions = {
      qNo: option.questionNo,
      mNo: option.userNo,
      language: option.compiler,
      sourceCode: option.source,
      result: option.process[0].result,
      date: moment().format('YYYY-MM-DD')
    }
    /* 컴파일 점수 생성 */
    if( option.process.length > 1 ){
      conditions.result = option.process.reduce(
        (prev, current, index)=>{
          return ( index === 1 ) ?  prev.result + current.result : prev + current.rseult;
        }
      ) / option.process.length
    }
    /* Object의 key, value 분리 */
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
      if( error ){
        reject( error );
      } else {
        update(); // update database 'battlecode_stats'

        console.log('[COMPILE FINISH]');
        option.finish = true;
        resolve( option );
      }
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