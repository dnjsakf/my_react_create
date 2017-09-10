import express from 'express';
import mysql from 'mysql';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(()=>{
  console.log('[mysql connection] - compile');
});

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

router.post('/python', (req, res)=>{
  const test = compilePython( test_sourcecode, test_testcase );

  return res.status(200).json({
    success: true,
    data: test
  });
})


export default router

import { spawn } from 'child_process';
import fs from 'fs';

function compilePython( sourcecode, testcase ){
  // Need a sourcecode save path;
  fs.writeFileSync( 'test.py', sourcecode.join('\n'), 'utf-8' );

  return compile( testcase);
}



function compile( testcase ){
  let compared = {};
  testcase.map((CASE, index)=>{
    console.log(`[CASE ${index}]`)
    CASE.input.map((input, inputIndex)=>{
      compared[index] = {};

      let subCompiler = spawn('python', ['test.py']);
      subCompiler.stdout.setEncoding("utf8");
      subCompiler.stderr.setEncoding("utf8");
      // subCompiler.stdout.pipe(process.stdout);
      // subCompiler.stdin.pipe(process.stdin);

      const stdin = new Promise((resolve, reject)=>{
        console.log(`[input] ${input}$`);
        subCompiler.stdin.write(input);
        subCompiler.stdin.end();
        subCompiler.stdout.on('data', (data)=>{
          resolve(data);
        });
        subCompiler.stderr.on('data', (error)=>{
          reject(error);
        });
      });
      
      stdin.then((data)=>{
        console.log(index,'[output end]', data);
        compared[index] = data;
      });
    });
  }); 

  return compared;
}

/**
 * 
        child.stdin.end(()=>{
          console.log('[1. STDIN END]');
        });
        child.stdout.on('end', ()=>{
          console.log('[3. STDOUT END]');
        })
        child.on('error', (error)=>{
          console.log('[5. ERROR]', error);
          reject(error);
        });
        child.on('exit', ()=>{
          console.log('[6. EXIT]');
        });
        child.on('close', ()=>{
          console.log('[7. CLOSE]');
        });
 */