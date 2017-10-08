'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveSource = saveSource;
exports.getTestcase = getTestcase;
exports.createCompiler = createCompiler;
exports.run = run;
exports.processSingleCase = processSingleCase;
exports.saveCompileResult = saveCompileResult;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _updateStats = require('./../config/database/updateStats');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});
conn.connect(function () {
  console.log('[mysql-connection] - compiler');
});

/* 1. 유저 이름의 폴더에 소스코드 저장: promise */
function saveSource(option) {
  return new Promise(function (resolve, reject) {
    var extension = option.compiler.toLowerCase();
    if (extension === 'python') {
      extension = 'py';
    }
    option.savePath = _path2.default.join(__dirname, './../../data/compile', option.folderName);
    option.saveFile = _path2.default.join(option.savePath, 'MAIN.' + extension);

    /* 폴더 생성 || 기존에 폴더가 있다면 파일만 생성 */
    _fs2.default.mkdir(option.savePath, '0777', function (error_dir) {
      /* 폴더가 이미 생성되어있음 */
      if (error_dir && error_dir.code !== 'EEXIST') {
        console.error('[SOURCE-DIR]\n', error_dir);
        reject(error_dir);
      } else {
        /* 파일 생성 */
        _fs2.default.writeFile(option.saveFile, option.source, function (error_file) {
          if (error_file) {
            console.log('[SOURCE-FILE]\n', error_file);
            reject(error_file);
          }
          resolve(option);
        });
      }
    });
  });
}

/* 2. 테스트케이스 가져오기: promise */
function getTestcase(option) {
  return new Promise(function (resolve, reject) {
    var sql = 'SELECT input, output FROM questions WHERE no = ' + option.questionNo;
    conn.query(sql, function (error, exist) {
      if (error) reject(error);
      if (exist.length === 0) {
        reject('Error: Not Found Testcase');
      }
      /** setting testcase */
      var inputs = JSON.parse(exist[0].input);
      var outputs = JSON.parse(exist[0].output);
      option.testcase = inputs.map(function (input, index) {
        return { input: input, output: outputs[index] };
      });
      resolve(option);
    });
  });
}

/* 3. 컴파일러 생성 */
function createCompiler(option) {
  option.compilers = [];
  switch (option.compiler.toLowerCase()) {
    case 'python':
      return new Promise(function (resolve, reject) {
        for (var index = 0; index < option.testcase.length; index++) {
          var child = _child_process2.default.spawn('python', [_path2.default.join(option.savePath, 'MAIN.py')]);

          child.stdout.setEncoding("utf8");
          child.stderr.setEncoding("utf8");

          child.compilerName = 'python_' + index;

          option.compilers.push(child);
        }
        if (option.compilers.length === 0) {
          reject('Error: compiler is empty');
        } else {
          resolve(option);
        }
      });
      break;
    case 'java':
      return new Promise(function (resolve, reject) {
        var cmdJavac = 'cd ' + option.savePath + ' & javac MAIN.java -encoding utf-8';
        _child_process2.default.exec(cmdJavac, function (error_javac) {
          if (error_javac) {
            console.log('[ERROR: javac]\n', error_javac);

            reject(error_javac.message.replace(/Command failed:.+java:/g, ''));
          }
          for (var index = 0; index < option.testcase.length; index++) {
            var child = _child_process2.default.spawn('java', ['MAIN'], { cwd: option.savePath });

            child.stdout.setEncoding("utf8");
            child.stderr.setEncoding("utf8");

            child.compilerName = 'java_' + index;

            option.compilers.push(child);
          }
          if (option.compiler.length === 0) {
            reject('Error: compiler is empty');
          } else {
            resolve(option);
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
      return new Promise(function (resolve, reject) {
        var cmdGcc = 'cd ' + option.savePath + ' & gcc -o MAIN MAIN.c';
        _child_process2.default.exec(cmdGcc, function (cmdErrorGcc) {
          if (cmdErrorGcc) {
            console.log('[ERROR: GCC]\n', cmdErrorGcc);
            reject(cmdErrorGcc.message);
          }
          for (var index = 0; index < option.testcase.length; index++) {
            var child = _child_process2.default.spawn('MAIN.exe', { cwd: option.savePath });

            child.stdout.setEncoding("utf8");
            child.stderr.setEncoding("utf8");

            child.compilerName = 'c_' + index;

            option.compilers.push(child);
          }
          if (option.compiler.length === 0) {
            reject('Error: compiler is empty');
          } else {
            resolve(option);
          }
        });
      });
      break;
    default:
      return new Promise(function (resolve, reject) {
        if (true) {
          reject('Error: invalid language');
        } else {
          resolve('TODO');
        }
      });
      break;
  }
}

/* 4. 컴파일 실행 */
function run(option) {
  return new Promise(function (resolve, reject) {
    var promises = option.compilers.map(function (compiler, index) {
      return processSingleCase(compiler, option.testcase[index]);
    });
    if (promises.length !== 0) {
      Promise.all(promises).then(function (result) {
        option.process = result;
        resolve(option);
      }).catch(function (error) {
        reject(error);
      });
    } else {
      reject('error');
    }
  });
}

/* 5. 단위 처리 */
function processSingleCase(compiler, testcase) {
  console.log('[process compiler]', compiler.compilerName, compiler.pid, testcase);
  return new Promise(function (resolve, reject) {
    compiler.stdout.setEncoding("utf-8");
    compiler.stderr.setEncoding("utf-8");

    /* stdin */
    var result = {};
    result.input = testcase.input;
    testcase.input.map(function (input) {
      if (process.platform === 'linux') {
        compiler.stdin.write('"' + input + '\n"');
      } else {
        compiler.stdin.write(input + '\n');
      }
    });
    compiler.stdin.end(function () {
      console.log('[process end-stdin]', compiler.compilerName);
    });

    /* stdout */
    var outputs = [];
    compiler.stdout.on('data', function (output) {
      outputs = outputs.concat(clearLastBlank(output.toString().split(/\r?\n/gm)));
      console.log('[process stdout]', compiler.compilerName, testcase.output, outputs);
    });

    /* stderr */
    compiler.stderr.on('data', function (error) {
      console.log('[process stderr]', compiler.compilerName, error);
      result.result = [0];
      result.error = error;
      resolve(result);
    });

    compiler.stdout.on('end', function () {
      result.output = outputs;
      result.result = outputs.filter(function (output, index) {
        return output === testcase.output[index];
      }).length / testcase.output.length * 100;
      resolve(result);
    });
    compiler.on('error', function (error) {
      console.log('[compiler error]', error);
      reject(error);
    });
  });
}

function saveCompileResult(option) {
  return new Promise(function (resolve, reject) {
    var conditions = {
      qNo: option.questionNo,
      mNo: option.userNo,
      language: option.compiler,
      sourceCode: option.source,
      result: option.process[0].result,
      date: (0, _moment2.default)().format('YYYY-MM-DD')
      /* 컴파일 점수 생성 */
    };if (option.process.length > 1) {
      conditions.result = option.process.reduce(function (prev, current, index) {
        return index === 1 ? prev.result + current.result : prev + current.rseult;
      }) / option.process.length;
    }
    /* Object의 key, value 분리 */
    var info = function (_data) {
      var keys = Object.keys(_data);
      var values = [];
      keys.map(function (key) {
        values.push(_data[key]);
      });
      return { keys: keys, values: values };
    }(conditions);

    var INSERT = 'INSERT INTO qState ( ' + info.keys.join(', ') + ' ) values ( ? )';
    conn.query(INSERT, [info.values], function (error, result) {
      if (error) {
        reject(error);
      } else {
        (0, _updateStats.update)(); // update database 'battlecode_stats'

        console.log('[COMPILE FINISH]');
        option.finish = true;
        resolve(option);
      }
    });
  });
}

/**
 * split 하면 맨 뒤에 공백이 하나 추가됨 이를 제거함
 */
function clearLastBlank(arr) {
  var cleared = arr;
  cleared.map(function (item, index) {
    if (item === '') {
      cleared.splice(index, 1);
    }
  });
  return cleared;
}