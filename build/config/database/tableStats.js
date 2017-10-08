'use strict';

var mysql = require('mysql');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode_stats'
});

conn.connect(function () {
  console.log('[mysql-connection] - config-mysql');
});

var tableNames = ['member', 'notice', 'report', 'questions', 'qState'];

function updateCountRecord() {

  var promise = Promise.all([countTable('member'), countTable('notice'), countTable('report'), countTable('questions'), countTable('qState')]);

  promise.then(function (result) {
    console.log('[promise-success]', result);
    try {
      var updated = function (_fields, _count) {
        var data = {};
        _fields.map(function (el, index) {
          data[el] = _count[index];
        });
        return data;
      }(tableNames, result);
      return updated;
    } catch (e) {
      console.error(e);
      process.exit();
    }
  }).then(function (updated) {
    updateCount(updated).then(function (result) {
      console.log('updated completed');
      console.log(updated);
      console.log(result.message);
      process.exit();
    }).catch(function (error) {
      console.log(error);
      process.exit();
    });
  }).catch(function (error) {
    console.log('[promise-error]', error);
    process.exit();
  });
}
function countTable(tableName) {
  return new Promise(function (resolve, reject) {
    try {
      var sql = 'SELECT count(*) AS count FROM battlecode.' + tableName;
      conn.query(sql, function (error, result) {
        if (error) {
          reject(error);
        };
        resolve(result[0].count);
      });
    } catch (e) {
      reject(e);
    }
  });
}
function updateCount(updated) {
  return new Promise(function (resolve, reject) {
    try {
      var sql = 'UPDATE count_records SET ?';
      conn.query(sql, [updated], function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
}

updateCountRecord();