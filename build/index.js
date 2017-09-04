'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _routes = require('./routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var expressPort = 8080;
var webpackPort = 4000;

// Setting
app.use(_bodyParser2.default.json());
app.use(function (error, req, res, next) {
  console.error('[throw-error]', error.stack);
  return res.status(500).json({
    error: error,
    code: 500,
    msg: "Something broken!!!"
  });
});
app.use((0, _expressSession2.default)({
  secret: "dolf@@c(*@_ASD",
  resave: false,
  saveUninitialized: true
}));

// Router Controll
app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public')));
app.use('/api/data', [_routes.algorithm]);
app.use('/api/auth', [_routes.auth]);
app.get('*', function (req, res) {
  return res.status(200).sendFile(_path2.default.join(__dirname, './../public/index.html'));
});

app.listen(expressPort, function () {
  console.log('[express] Server is running on port:', expressPort);
});
if (process.env.NODE_ENV === 'development') {
  console.log('[express server is running]');
  var config = require('../webpack.dev.config');
  var compiler = (0, _webpack2.default)(config);
  var devServer = new _webpackDevServer2.default(compiler, config.devServer);
  devServer.listen(webpackPort, function () {
    console.log('[webpack-dev] Server is running on port:', webpackPort);
  });
}