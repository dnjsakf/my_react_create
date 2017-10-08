'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});

router.post('/submit', function (req, res) {
  console.log(req.body);
  /**
   * Invalid Type Check
   */
  if (typeof req.body.questionNo === 'undefined') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }
  if (typeof req.body.userNo === 'undefined') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }
  if (typeof req.body.reportType === 'undefined') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }
  if (typeof req.body.reportDetail === 'undefined') {
    return res.status(403).json({
      error: 'Invalid type',
      code: 1
    });
  }

  /**
   * Start Query
   */
  var insertObject = {
    qNo: req.body.questionNo,
    mNo: req.body.userNo,
    type: req.body.reportType,
    detail: req.body.reportDetail,
    date: (0, _moment2.default)().format('YYYY-MM-DD')
  };
  var conditions = function (data) {
    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return false;

    var fieldNames = Object.keys(data);
    var values = [];
    fieldNames.map(function (field, index) {
      values.push(data[field]);
    });
    return [fieldNames, values];
  }(insertObject);

  var insert = 'INSERT INTO report ( ' + conditions[0] + ' )  VALUES ( ? ) ;';
  try {
    conn.query(insert, [conditions[1]], function (error, inserted) {
      if (error) throw error;
      // 여기에 추가 적으로 
      // insert 실패했을때 결과 출력시켜야됨.
      if (inserted.affectedRows === 0) {
        return res.status(403).json({
          error: 'Failed insert',
          code: 2
        });
      }
      return res.status(200).json({
        success: true
      });
    });
  } catch (e) {
    console.log('[report insert exception]', e);
    return res.status(500).json({
      error: 'Exceoption error',
      code: 444
    });
  }
});

exports.default = router;