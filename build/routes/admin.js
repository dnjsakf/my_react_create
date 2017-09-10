'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});

router.get('/stats/notice', function (req, res) {
  var sql = 'SELECT notice FROM battlecode_stats.board';
  conn.query(sql, function (error, result) {
    if (error) throw error;
    if (result.length === 0) {
      return res.status(404).json({
        error: 'No search data',
        code: 1
      });
    }
    return res.status(200).json({
      success: true,
      count: result[0].notice
    });
  });
});

exports.default = router;