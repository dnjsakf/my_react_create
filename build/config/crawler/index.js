'use strict';

var crawler = require('./crawler');
var express = require('express');
var bodyParser = require('body-parser');

var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (error, req, res, next) {
  console.error('[throw-error]', error.stack);
  return res.status(500).json({
    error: error,
    code: 500,
    msg: "Something broken!!!"
  });
});

app.get('/crawler', function (req, res) {
  return res.sendFile(path.join(__dirname, 'crawler.html'));
});
app.post('/crawler/backjoon', function (req, res) {
  if (typeof req.body.url === 'undefined') throw 'undefined url';
  if (typeof req.body.start === 'undefined') throw 'undefined start';
  if (typeof req.body.end === 'undefined') throw 'undefined end';

  crawler.backjoon(req.body.url, req.body.start, req.body.end, function (error, result) {
    if (error) throw error;
    res.status(200).json(result);
  });
});

app.listen('8000', function () {
  console.log('[crawler-server-connection]');
});