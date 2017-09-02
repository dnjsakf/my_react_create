'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = _express2.default.Router();

// Connect Database
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});
conn.connect(function () {
  console.log('[mysql-connected]');
});

router.get('/data/algorithm/list', function (req, res) {
  console.log('[LIST]', req.query);

  var sql = 'SELECT no, subject FROM questions';
  conn.query(sql, function (error, subjects) {
    if (error) throw error;
    if (subjects.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'NOT FOUND',
        code: 0
      });
    }
    return res.status(200).json({
      success: true,
      subjects: subjects
    });
  });
});

router.get('/data/algorithm/data/:questionNo', function (req, res) {
  console.log('[DATA]', req.params.questionNo, req.query);

  var questionNO = req.params.questionNo;
  var sql = 'SELECT * FROM questions WHERE no = ? ';
  conn.query(sql, questionNO, function (error, question) {
    if (error) throw error;
    if (question.lenght === 0) {
      return res.status(404).json(_defineProperty({
        error: 'Not Found'
      }, 'error', 0));
    }

    return res.status(200).json({
      success: true,
      question: question[0]
    });
  });
});

exports.default = router;