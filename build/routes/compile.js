'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var compiler = require('./compiler.js');

var router = _express2.default.Router();

/**
 * Save Source Code
 */
router.post('/save/sourceCode/:language', function (req, res) {
  var User = req.session.user;

  /** 잘못된 접근 */
  if (typeof req.params.language === 'undefined') {
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }
  if (typeof User === 'undefined') {
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }
  /** 잘못된 값 */
  if (typeof req.body.questionNo === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: Type of questionNo is undefined',
      code: 403
    });
  }
  if (typeof req.body.sourceCode !== 'string') {
    return res.status(403).json({
      error: 'Type Error: Type of sourceCode is only string',
      code: 403
    });
  }
  var option = {
    folderName: User.displayName,
    compiler: req.params.language,
    source: req.body.sourceCode
  };
  compiler.saveSource(option).then(function (savedpath) {
    res.status(200).json({
      success: true
    });
  }).catch(function (error) {
    res.status(500).json({
      error: error,
      code: 500
    });
  });
});

router.post('/:language/:questionNo', function (req, res) {
  var User = req.session.user;
  /**
   * Valid Check
   */
  if (typeof User === 'undefined') {
    return res.status(400).json({
      error: 'Invalid Connection',
      code: 400
    });
  }

  if (typeof req.params.language === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: Type of language is undefined',
      code: 403
    });
  }
  if (typeof req.params.questionNo === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: Type of questionNo is undefined',
      code: 403
    });
  }
  if (typeof req.body.sourceCode === 'undefined') {
    return res.status(403).json({
      error: 'Type Error: Type of sourceCode is undefined',
      code: 403
    });
  }

  var option = {
    questionNo: req.params.questionNo,
    userNo: User.no,
    folderName: User.displayName,
    compiler: req.params.language,
    source: req.body.sourceCode

    /* 1. 소스코드 저장 */
  };console.log('[CHECK]\n', option);
  compiler.saveSource(option).then( /* 2. 테스트케이스 가져오기 */
  compiler.getTestcase, function (error) {
    console.log('[테스트케이스 가져오기 실패]\n', error);
    throw error;
  }).catch(function (error) {
    throw error;
  }).then( /* 3. 컴파일러 생성 */
  compiler.createCompiler, function (error) {
    console.log('[컴파일러 생성 실패]\n', error);
    throw error;
  }).catch(function (error) {
    throw error;
  }).then( /* 4-1. 컴파일 실행 */
  compiler.run, function (error) {
    console.log('[컴파일 실행 실패]\n', error);
    throw error;
  }).catch(function (error) {
    throw error;
  }).then( /* 5. 컴파일 결과 저장 */
  compiler.saveCompileResult, function (error) {
    console.log('[결과 저장 실패]\n', error);
    throw error;
  }).catch(function (error) {
    throw error;
  }).then(function (result) {
    console.log('[컴파일 성공]\n', result.process);
    res.status(200).json({
      success: true,
      result: result.process
    });
  }, function (error) {
    console.log('[보내기 실패]\n', error);
    throw error;
  }).catch(function (error) {
    /* 컴파일 최종 실패 */
    console.log('[최종 에러]', JSON.parse(JSON.stringify(error)));
    res.status(200).json({
      success: false,
      result: error
    });
  });
});

exports.default = router;