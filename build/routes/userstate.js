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

var router = _express2.default.Router();
var conn = _mysql2.default.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode'
});

/**
 * TODO: 회원정보 추가
 * 많이 쓸일은 없을 듯 하다.
 * 그래도 기본적인 기능만 구현해두자.
 */

router.put('/insert', function (req, res) {
  return res.status(200).json({
    success: true
  });
});

/**
 * TODO: 회원정보 변경
 * 현재는 사용자의 이름, 비밀번호만 변경가능하도록 하자.
 * params도 추가해서 환경설정 정보도 추가하도록 해야겠네
 * 
 * mode: ['setting', 'default', 'restrict']
 * 
 */
router.post('/update/:mode', function (req, res) {
  var session = req.session;
  var mode = req.params.mode;
  var username = req.body.username;
  console.log(mode);

  if (typeof session.user === 'undefined') {
    return res.status(404).json({
      error: 'Invliad connect',
      code: 0
    });
  }
  if (session.user.username !== req.body.username) {
    return res.status(403).json({
      error: 'No matched username',
      code: 1
    });
  }

  switch (mode) {
    case 'default':
      var updateDefault = {};
      // 유효성 검사도 해줘야될듯?
      if (typeof req.body.displayName !== 'undefined') {
        updateDefault.name = req.body.displayName;
      }
      if (typeof req.body.password !== 'undefined') {
        updateDefault.password = _bcryptjs2.default.hash(req.body.password, 8);
      }
      if (Object.keys(updateDefault).length === 0) {
        return res.status(400).json({
          error: 'Not found data',
          code: 2
        });
      }

      var sqlDefault = 'UPDATE member SET ? WHERE email = ?';
      conn.query(sqlDefault, [updateDefault, username], function (error, updated) {
        if (error) throw error;
        // 아 기억이 안난다.ㅇ아아아아.
        if (updated.changedRows === 0) {
          return res.status(400).json({
            error: 'no chagned',
            code: 4
          });
        }

        if (typeof updateDefault.name !== 'undefined') {
          session.user.displayName = updateDefault.name;
        }
        return res.status(200).json({
          success: true
        });
      });
      break;
    case 'setting':
      var updateSetting = {};
      // 에디터_테마
      if (typeof req.body.theme !== 'undefined') {
        updateSetting.setting_editor_theme = req.body.theme;
      }
      // 에디터_기본언어
      if (typeof req.body.language !== 'undefined') {
        updateSetting.setting_editor_language = req.body.language;
      }
      // 에디터_폰트
      if (typeof req.body.font !== 'undefined') {
        updateSetting.setting_editor_font = req.body.font;
      }
      // 에디터_폰트사이즈
      if (typeof req.body.fontSize !== 'undefined') {
        updateSetting.setting_editor_fontsize = req.body.fontSize;
      }

      if (Object.keys(updateSetting).length === 0) {
        return res.status(400).json({
          error: 'Not found data',
          code: 2
        });
      }
      var sqlSetting = 'UPDATE member SET ? WHERE email = ?';
      conn.query(sqlSetting, [updateSetting, username], function (error, updated) {
        if (error) throw error;
        if (updated.changedRows === 0) {
          return res.status(400).json({
            error: 'no chagned',
            code: 4
          });
        }

        // 업데이트에 성공하면 session change
        if (typeof updateSetting.setting_editor_theme !== 'undefined') {
          session.user.editor.editorTheme = updateSetting.setting_editor_theme;
        }
        if (typeof updateSetting.setting_editor_language !== 'undefined') {
          session.user.editor.editorLanguage = updateSetting.setting_editor_language;
        }
        if (typeof updateSetting.setting_editor_font !== 'undefined') {
          session.user.editor.editorFont = updateSetting.setting_editor_font;
        }
        if (typeof updateSetting.setting_editor_fontsize !== 'undefined') {
          session.user.editor.editorFontSize = updateSetting.setting_editor_fontsize;
        }

        return res.status(200).json({
          success: true
        });
      });
      break;

    case 'restrict':
      return res.status(500).json({
        error: 'Implement not yet',
        code: 99
      });
      break;
    default:
      return res.status(403).json({
        error: 'undefined mode',
        code: 4
      });
      break;
  }
});

/**
 * TODO: 회원탈퇴
 */
router.delete('/delete', function (req, res) {
  var session = req.session;
  if (typeof session.user === 'undefined') {
    return res.status(404).json({
      error: 'Invliad connect',
      code: 0
    });
  }
  if (session.user.username !== req.body.username) {
    return res.status(403).json({
      error: 'No matched username',
      code: 1
    });
  }

  var sqlDelete = 'DELETE FROM member WHERE email = ?';
  conn.query(sqlDelete, function (error, result) {
    if (error) throw error;
    // TODO: result 

    return res.status(200).json({
      success: true
    });
  });
});

exports.default = router;