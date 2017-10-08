'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _query = require('./../config/database/query');

var _query2 = _interopRequireDefault(_query);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});

router.get('/list', function (req, res) {
  /**
   * Invalid Check
   */
  if (typeof req.query.page === 'undeinfed') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }
  if (typeof req.query.count === 'undeinfed') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }

  var count = req.query.count;
  var rows = (req.query.page - 1) * count;
  var noticeRecords = 'SELECT * FROM notice ORDER BY no DESC LIMIT ' + rows + ', ' + count;

  var query = ['SELECT', ['notice.no as no', 'notice.topic as topic', 'notice.subject as subject', 'member.name as author', 'notice.content as content', 'notice.date as date'].join(" , "), 'FROM notice', 'INNER JOIN member ON member.no = notice.author', 'ORDER BY notice.no DESC', 'LIMIT ' + rows + ', ' + count].join(" ");

  try {
    conn.query(query, function (error, exist) {
      if (error) throw error;
      try {
        var reocrdsCount = _query2.default.count('notice');
        console.log(reocrdsCount);
        conn.query(reocrdsCount, function (error, result) {
          if (error) throw error;

          var nmg = result[0].count % req.query.count;
          var maxPage = parseInt(result[0].count / req.query.count);
          if (nmg > 0) maxPage += 1;

          return res.status(200).json({
            success: true,
            maxPage: maxPage,
            records: exist
          });
        });
      } catch (exception) {
        console.log('[exception]', exception);
        return res.status(500).json({
          error: 'MyQuery.count error',
          code: 500,
          exception: exception
        });
      }
    });
  } catch (exception) {
    console.error('[Exception]', exception);
    return res.status(500).json({
      error: 'MySQl noticeRecords',
      exception: exception,
      code: 500
    });
  }
});

exports.default = router;