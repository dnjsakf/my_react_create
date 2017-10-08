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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var router = _express2.default.Router();

// Connect Database
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});
conn.connect(function () {
  console.log('[mysql-connected] - algorithm');
});

/**
 * Get Algorithm List
 * 
 * 이거 param 안꼬이게 수정해줘야됨
 */
router.get('/algorithm/:type', function (req, res) {
  if (typeof req.params.type === 'undefined') {
    return res.status(403).json({
      error: 'Invalid connection',
      code: 403
    });
  }

  switch (req.params.type) {
    // 전체 알고리즘
    case 'list':
      var listQuery = 'SELECT no, subject FROM questions';
      conn.query(listQuery, function (error, subjects) {
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
      break;
    // 내 알고리즘  
    case 'myalgo':
      if (typeof req.session.user === 'undefined') {
        return res.status(500).json({
          error: 'Invalid user',
          code: 500
        });
      }
      var findSolvedNumber = 'SELECT DISTINCT qNo FROM qState WHERE mNo = ?';
      conn.query(findSolvedNumber, [req.session.user.no], function (error, exists) {
        if (error) throw error;
        if (exists.length === 0) {
          return res.status(404).json({
            error: 'Not Found List',
            code: 404
          });
        }

        var inners = function (arr) {
          var _in = [];
          arr.map(function (obj, index) {
            _in.push(arr[index].qNo);
          });
          return _in;
        }(exists);

        var findSolvedContent = 'SELECT no, subject FROM questions WHERE no IN ( ? )';
        conn.query(findSolvedContent, [inners], function (error, subjects) {
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
      break;

    default:
      return res.status(403).json({
        error: 'Invalid connection',
        code: 403
      });
  }
});

/**
 * Get Algorithm Detail Data
 */
router.get('/algorithm/data/:questionNo', function (req, res) {
  console.log('[GetAlgorithmData]', req.params.questionNo);
  if (typeof req.params.questionNo === 'undefined') {
    return res.status(403).json({
      error: "Invalid connection",
      code: 1
    });
  }
  var questionFields = ['no', 'subject', 'text', 'input_info', 'output_info', 'input', 'output', 'regno', 'date'].join(', ');
  var question = 'SELECT ' + questionFields + ' FROM questions WHERE no = ? ';
  conn.query(question, [req.params.questionNo], function (error, question) {
    if (error) throw error;
    if (question.lenght === 0) {
      return res.status(404).json(_defineProperty({
        error: 'Not Found'
      }, 'error', 0));
    }
    var dashboardFields = ['challenger', 'current', 'perfect', 'c', 'java', 'python'].join(', ');
    var dashboard = ['SELECT ' + dashboardFields, 'FROM battlecode_stats.total', 'WHERE question = ' + req.params.questionNo].join(' ');
    conn.query(dashboard, function (error, stats) {
      if (error) throw error;
      if (stats.length === 0) {
        return res.status(404).json({
          error: 'Not Found Dashboard Stats',
          code: 404
        });
      }
      console.log(stats[0]);
      return res.status(200).json({
        success: true,
        question: question[0],
        stats: stats[0]
      });
    });
  });
});

/**
 * Get Algorithm state for "Dashboard"
 */
/**
 * 내 알고리즘에서 보여줄 때랑 구분해줘야됨
 */
router.get('/dashboard/state', function (req, res) {
  /**
   * Check Validation
   */
  if (typeof req.query.questionNo === 'undefined') {
    return res.status(403).json({
      error: 'Invalid Question Number',
      code: 0
    });
  }
  if (typeof req.query.dashboard === 'undefined') {
    return res.status(403).json({
      error: 'Invalid dashboard title',
      code: 1
    });
  }
  if (typeof req.query.page === 'undefined') {
    return res.status(403).json({
      error: 'Invalid page',
      code: 1
    });
  }
  if (typeof req.query.count === 'undefined') {
    return res.status(403).json({
      error: 'Invalid count',
      code: 1
    });
  }
  if (typeof req.query.sort === 'undefined') {
    return res.status(403).json({
      error: 'Invalid sort',
      code: 1
    });
  }

  /**
   * Start Query
   */
  var mode = req.query.dashboard; // perfect, language, challenger(=all), 
  var tables = {
    main: 'qState',
    join: ['member', 'questions']
  };
  var conditions = {
    qNo: parseInt(req.query.questionNo),
    page: parseInt(req.query.page),
    count: parseInt(req.query.count)
  };
  if (req.query.isMyAlgo === 'true') {
    conditions.except = { mNo: req.session.user.no };
  }

  var sort = req.query.sort;
  try {
    /**
     * 1. Query: Get Dashboard List
     */
    var dashboardRecords = _query2.default.dashboard(mode, tables, conditions, sort);
    conn.query(dashboardRecords, function (error, exists) {
      if (error) throw error;
      if (exists.length === 0) {
        return res.status(404).json({
          error: 'Not found data',
          code: 2
        });
      }
      // 이거 왜 저장했지??
      req.session.question = { state: exists };

      /**
       * 2. Query: Get Dashboard Some-Field Total Count
       */
      var countOption = {
        qNo: parseInt(req.query.questionNo),
        language: mode
      };

      console.log('[querys]\n', req.query.isMyAlgo === 'true');
      if (req.query.isMyAlgo === 'true') {
        countOption.except = { mNo: req.session.user.no };
      }

      try {
        var recordCount = _query2.default.count('qState', 'qNo', countOption);
        conn.query(recordCount, function (error, result) {
          if (error) throw error;

          var maxPage = 1;
          if (result.length > 0) {
            var nmg = result[0].count % req.query.count;
            maxPage = parseInt(result[0].count / req.query.count);
            if (nmg > 0) maxPage += 1;
          }

          var myRecords = {
            'java': [],
            'python': [],
            'c': []
          };
          var otherRecords = [];
          if (req.query.isMyAlgo === 'true') {
            exists.map(function (row, index) {
              if (row.mNo === req.session.user.no) {
                myRecords[row.language].push(row);
              } else {
                otherRecords.push(row);
              }
            });
          } else {
            otherRecords = exists;
          }
          return res.status(200).json({
            success: true,
            maxPage: maxPage,
            records: otherRecords,
            myRecords: myRecords
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
    console.log('[exception]', exception);
    return res.status(500).json({
      error: 'mySql query error',
      code: 500
    });
  }
});

router.get('/compare/:target/:mode/:questionNo/:language/:no/', function (req, res) {
  if (typeof req.params.target === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: target is undefined',
      code: 403
    });
  }
  if (typeof req.params.mode === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: mode is undefined',
      code: 403
    });
  }
  if (typeof req.params.questionNo === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: questionNo is undefined',
      code: 403
    });
  }
  if (typeof req.params.language === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: language is undefined',
      code: 403
    });
  }
  if (typeof req.params.no === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: no is undefined',
      code: 403
    });
  }

  var query = ['SELECT', ['qState.no as no', 'member.name as name', 'qState.language as language', 'qState.sourceCode as sourceCode', 'qState.result as result', 'qState.date as date'].join(', '), 'FROM qState', 'INNER JOIN member ON qState.mNo = member.no', 'WHERE qState.qNo = ' + req.params.questionNo, 'AND qState.language = "' + req.params.language + '"', req.params.target === 'my' ? 'AND qState.mNo = ' + req.session.user.no : 'AND NOT qState.mNo = ' + req.session.user.no, req.params.mode === 'next' ? 'AND qState.no > ' + req.params.no : 'AND qState.no < ' + req.params.no, req.params.mode === 'next' ? 'ORDER BY qState.no ASC' : 'ORDER BY qState.no DESC', 'LIMIT 1'].join(' ');

  conn.query(query, function (error, exist) {
    if (error) throw error;
    if (exist.length === 0) {
      return res.status(404).json({
        error: 'Not Found Data',
        code: 403
      });
    }

    return res.status(200).json({
      success: true,
      data: exist[0]
    });
  });
});

exports.default = router;