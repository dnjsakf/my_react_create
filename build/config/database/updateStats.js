'use strict';

var mysql = require('mysql');
var query = require('./query');
var moment = require('moment');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode_stats'
});

conn.connect(function (error) {
  if (error) {
    console.error(error);
    throw error;
  } else {
    console.log('[mysql-connection] - config-mysql');

    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      updateQuestionDashboard();
    }
  }
});

function updateQuestionDashboard() {
  console.log('[UPDATE-STATS-RUN]');

  var challenger = searchChallenger('all');
  var current = searchCurrent('all');
  var perfect = searchPerfect('all');
  var language = searchLanguage('all', 'all');

  Promise.all([challenger, current, perfect, language]).then(function (result) {
    var total = {};
    result.map(function (item, index) {
      item.map(function (data) {
        if (typeof total[data.question] === 'undefined') {
          total[data.question] = {
            challenger: 0,
            current: 0,
            perfect: 0,
            c: 0,
            java: 0,
            python: 0
          };
        }
        total[data.question][data.data.mode] = data.data.count;
      });
    });
    // console.log('[Finish!!]');
    return total;
  }).then(function (total) {
    // console.log('[Start Total]\n', total);
    var promise = [];
    var questions = Object.keys(total);
    questions.map(function (question, index) {
      promise.push(new Promise(function (resolve, reject) {
        updateTotal(question, total[question], resolve, reject);
      }));
    });

    Promise.all(promise).then(function (result) {
      console.log('[Finish Total]\n', result);
      // process.exit();
    }).catch(function () {
      // process.exit();
    });
  }).catch(function (error) {
    console.log(error);
    // process.exit();
  });
}

/**
 * 전체 통계
 */
function updateTotal(question, update, resolve, reject) {
  var sql = 'UPDATE total SET ? WHERE question = ?';
  conn.query(sql, [update, question], function (error, result) {
    if (error) {
      reject({
        mode: 'total',
        result: error
      });
    }
    resolve({
      question: question,
      result: result.message
    });
  });
}

/**
 * 도전자
 */
function searchChallenger(questionNo) {
  return new Promise(function (resolve, reject) {
    var select = query.challenger(questionNo);
    conn.query(select, function (error, result) {
      if (error) reject(error);

      // console.log( select );
      // console.log( result );

      var promise = [];
      var updateData = JSON.parse(JSON.stringify(result));
      updateData.map(function (data, index) {
        promise.push(new Promise(function (_resolve, _reject) {
          updateChallenger(data, _resolve, _reject);
        }));
      });
      Promise.all(promise).then(function (result) {
        // console.log('[challenger]', result);
        var convert = {};
        result.map(function (item) {});
        resolve(result);
      }).catch(function () {
        reject();
      });
    });
  });
}
function updateChallenger(data, resolve, reject) {
  var sql = 'UPDATE challenge SET challenger = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], function (error, result) {
    if (error) {
      reject({
        mode: 'challenger',
        result: error
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'challenger',
        count: data.count
      },
      result: result.message
    });
  });
}

/**
 * 정확도
 */
function searchCurrent(qusetionNo) {
  return new Promise(function (resolve, reject) {
    var select = query.current(qusetionNo);
    conn.query(select, function (error, result) {
      if (error) reject(error);
      var promise = [];
      var updateData = JSON.parse(JSON.stringify(result));
      updateData.map(function (data, index) {
        promise.push(new Promise(function (_resolve, _reject) {
          updateCurrent(data, _resolve, _reject);
        }));
      });
      Promise.all(promise).then(function (result) {
        // console.log('[current]', result);
        resolve(result);
      }).catch(function () {
        reject();
      });
    });
  });
}
function updateCurrent(data, resolve, reject) {
  var sql = 'UPDATE challenge SET current = ? WHERE question = ? ';
  conn.query(sql, [data.avg, data.question], function (error, result) {
    if (error) {
      reject({
        mode: 'current',
        result: error
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'current',
        count: data.avg
      },
      result: result.message });
  });
}

/**
 * 만점자
 */
function searchPerfect(qusetionNo) {
  return new Promise(function (resolve, reject) {
    var select = query.perfect(qusetionNo);
    conn.query(select, function (error, result) {
      if (error) reject(error);
      var promise = [];
      var updateData = JSON.parse(JSON.stringify(result));
      updateData.map(function (data, index) {
        promise.push(new Promise(function (_resolve, _reject) {
          updatePerfect(data, _resolve, _reject);
        }));
      });
      Promise.all(promise).then(function (result) {
        // console.log('[perfect]', result);
        resolve(result);
      }).catch(function () {
        reject();
      });
    });
  });
}
function updatePerfect(data, resolve, reject) {
  var sql = 'UPDATE challenge SET perfect = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], function (error, result) {
    if (error) {
      reject({
        mode: 'perfect',
        result: error
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'perfect',
        count: data.count
      },
      result: result.message });
  });
}

/**
 * 사용언어
 * perfect: boolaen
 */

function searchLanguage(questionNo, language, perfect) {
  return new Promise(function (resolve, reject) {
    var select = query.language(questionNo, language, perfect);
    conn.query(select, function (error, result) {
      if (error) reject(error);
      var promise = [];
      var updateData = JSON.parse(JSON.stringify(result));
      updateData.map(function (data, index) {
        promise.push(new Promise(function (_resolve, _reject) {
          updateLanguage(data, _resolve, _reject);
        }));
      });
      Promise.all(promise).then(function (result) {
        // console.log('[lengauge]', result);
        resolve(result);
      }).catch(function () {
        reject();
      });
    });
  });
}
function updateLanguage(data, resolve, reject) {
  var sql = 'UPDATE language SET ? WHERE question = ? ';
  var setting = {};
  setting[data.language] = data.count;

  conn.query(sql, [setting, data.question], function (error, result) {
    if (error) {
      reject({
        mode: data.language,
        result: error
      });
    };
    resolve({
      question: data.question,
      data: {
        mode: data.language,
        count: data.count
      },
      result: result.message
    });
  });
}

module.exports.update = updateQuestionDashboard;