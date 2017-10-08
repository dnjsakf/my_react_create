'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default: auth
var router = _express2.default.Router();
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.platform === 'linux' ? '1111' : 'wjddns1',
  database: 'battlecode'
});
conn.connect(function () {
  console.log('[mysql-connection] - /api/auth');
});

/**
 * 세션검사 이벤트
 */
router.post('/session', function (req, res) {
  var session = req.session;
  console.log('[session-check]', session.user);

  if (typeof session.user == 'undefined') {
    return res.status(400).json({
      success: false,
      error: 'Not found user session',
      code: 1
    });
  }

  return res.status(200).json({
    user: session.user
  });
});

/**
 *  로그인 이벤트 
 */
router.post('/login', function (req, res) {
  var session = req.session;
  var condition = {
    // get is syntax for save to session
    no: 'get',
    email: req.body.username,
    password: req.body.password,
    name: 'get',
    date: 'get',
    setting_editor_theme: 'get',
    setting_editor_language: 'get',
    setting_editor_font: 'get',
    setting_editor_fontsize: 'get'
  };
  var fields = Object.keys(condition);
  var findUser = 'SELECT ' + fields + ' FROM member WHERE email = ?';

  conn.query(findUser, [condition.email], function (error, exist) {
    if (error) throw error;
    if (exist.length === 0) {
      return res.status(404).json({
        error: 'Not found user',
        code: 0
      });
    }

    /* password hashed */
    if (_bcryptjs2.default.compareSync(condition.password, exist[0].password) === false) {
      return res.status(400).json({
        error: 'Invalid password',
        code: 1
      });
    }
    session.user = {
      no: exist[0].no,
      username: exist[0].email,
      displayName: exist[0].name,
      regDate: exist[0].date,
      editor: {
        editorTheme: exist[0].setting_editor_theme,
        editorLanguage: exist[0].setting_editor_language,
        editorFont: exist[0].setting_editor_font,
        editorFontSize: exist[0].setting_editor_fontsize
        /**
         * 기타 옵션들은
         * 추후에 필요할 때 추가하도록 하자. 
         */
      } };
    console.log('[session-check-login]', session.user);
    return res.status(200).json({
      success: true,
      user: session.user
    });
  });
});

/**
 * 로그아웃이벤트
 */
router.post('/logout', function (req, res) {
  var session = req.session;
  console.log('[session-check-logout]', session.user);
  if (typeof session.user !== 'undeinfed') {
    session.destroy(function (error) {
      return res.status(200).json({
        success: true
      });
    });
  } else {
    return res.status(400).json({
      error: 'undefined session',
      code: 1
    });
  }
});

/**
 * 회원가입이벤트
 */
router.post('/register', function (req, res) {
  var condition = {
    email: req.body.username,
    password: _bcryptjs2.default.hashSync(req.body.password, 8),
    name: req.body.displayName
  };
  console.log('[register]', condition);

  var maps = mapping(condition);
  var fields = maps[0];
  var values = maps[1];

  var selectUser = 'SELECT no FROM member WHERE email = ?';
  conn.query(selectUser, [condition.email], function (error, exist) {
    if (error) throw error;
    if (exist.length > 0) {
      return res.status(403).json({
        error: condition.email + ' is using by other',
        code: 3
      });
    }
    var insertUser = 'INSERT INTO member (' + fields + ')  VALUES ? ';
    conn.query(insertUser, [[values]], function (error, result) {
      if (error) throw error;
      if (result.length === 0) {
        return res.status(400).json({
          error: 'Register Error',
          code: 2
        });
      }
      return res.status(200).json({
        success: true
      });
    });
  });
});

/**
 * 비밀번호 체크 (MyPage)
 */
router.post('/passwordCheck', function (req, res) {

  console.log(req.body);
  var findUser = 'SELECT password FROM member WHERE email = ?';
  conn.query(findUser, [req.body.username], function (error, exist) {
    if (error) throw error;
    if (exist.length === 0) {
      return res.status(404).json({
        failure: false,
        error: 'Not found user',
        code: 1
      });
    }

    var passwordMatched = _bcryptjs2.default.compareSync(req.body.password, exist[0].password);
    if (!passwordMatched) {
      return res.status(400).json({
        failure: false,
        error: 'No matched password',
        code: 2
      });
    } else {
      return res.status(200).json({
        success: true
      });
    }
  });
});

function mapping(myObject) {
  var _values = [];
  var _fields = Object.keys(myObject);

  _fields.map(function (el) {
    _values.push(myObject[el]);
  });
  return [_fields, _values];
}

exports.default = router;