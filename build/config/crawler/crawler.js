'use strict';

module.exports.backjoon = function (_url, _start, _end, callback) {
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.platform === 'linux' ? '1111' : 'wjddns1',
    database: 'battlecode'
  });
  conn.connect(function (error) {
    if (error) throw error;
    console.log('[mysql-connection] - crawler');
  });

  var request = require('request'),
      cheerio = require('cheerio'),
      moment = require('moment'),
      route = require('express').Router(),
      fs = require('fs'),
      path = require('path');

  date = moment().format('YYYY-MM-DD');

  var crawled_data = {},
      urls = making_url(_url, _start, _end),
      problem = '';

  var promise = [],
      index = 0,
      end = urls.length;

  var _loop = function _loop() {
    var problem = urls[index];
    var req_promise = new Promise(function (resolve, reject) {
      request(problem, function (error, response, html) {
        console.log(index, ' - ', problem);
        if (error) {
          reject(false);
          throw error;
        }
        var $ = cheerio.load(html, { decodeEntities: false }),
            splited = problem.split('/');
        var key = splited[splited.length - 1];

        var $input_data = $('section#sampleinput > pre.sampledata'),
            $output_data = $('section#sampleoutput > pre.sampledata'),
            $original_source_data = $('section#source > ul > li'),
            $question = $('div#problem_description > *'),
            $input_info = $('div#problem_input > *'),
            $output_info = $('div#problem_output > *');

        var input_size = $input_data.length,
            output_size = $output_data.length,
            source_size = $original_source_data.length,
            question_size = $question.length,
            input_info_size = $input_info.length,
            output_info_size = $output_info.length;

        var input = [],
            output = [],
            original_source = [],
            question = [],
            input_info = [],
            output_info = [];

        // input
        for (var _index = 1; _index <= input_size; _index++) {
          var $tag = $input_data.eq(_index - 1);
          var text = $tag.text().toString();
          input.push(text.split(/\r?\n/));
        }
        input = clearLastBlank(input);

        // output
        for (var _index2 = 1; _index2 <= output_size; _index2++) {
          var _$tag = $output_data.eq(_index2 - 1);
          var _text = _$tag.text().toString();
          output.push(_text.split(/\r?\n/));
        }
        output = clearLastBlank(output);

        // question
        for (var _index3 = 1; _index3 <= question_size; _index3++) {
          var _$tag2 = $question.eq(_index3 - 1);

          // 이미지 저장
          if (_$tag2.find('img').length > 0) {
            (function () {
              var $img = _$tag2.find('img'),
                  imgPath = $img.attr('src');
              var imgURL = "https://www.acmicpc.net" + imgPath;
              var filename = imgPath.replace(/\/.*\//, '');
              var myPath = path.join('/images/questions/', filename);
              var savePath = path.join(__dirname, './../../../public', myPath);
              request.head(imgURL, function (err, res, body) {
                request(imgURL).pipe(fs.createWriteStream(savePath)).on('close', function () {});
              });
              $img.attr({ 'src': myPath });
              $img.removeAttr('style');
            })();
          }
          // question[index] = $tag.toString(); // 재탐색
          question.push(_$tag2.toString()); // 재탐색
          console.log("[Backjoon-Tag]", encodeURI(_$tag2.toString()));
        }

        // input_info
        for (var _index4 = 1; _index4 <= input_info_size; _index4++) {
          var _$tag3 = $input_info.eq(_index4 - 1);
          input_info.push(_$tag3.toString());
          // input_info[index] = $tag.toString();
        }

        // output_info
        for (var _index5 = 1; _index5 <= output_info_size; _index5++) {
          var _$tag4 = $output_info.eq(_index5 - 1);
          output_info.push(_$tag4.toString());
          // output_info[index] = $tag.toString();
        }

        // original_source
        for (var _index6 = 1; _index6 <= source_size; _index6++) {
          var _$tag5 = $original_source_data.eq(_index6 - 1);
          var _text2 = _$tag5.text().toString();
          original_source.push(_text2.replace(/[\n\t]/gm, ''));
        }

        crawled_data[key] = {
          // single_line
          'url': problem,
          'limit_time': $('table#problem-info td:nth-child(1)').text(),
          'limit_memory': $('table#problem-info td:nth-child(2)').text(),
          'challengers': $('table#problem-info td:nth-child(3)').text(),
          'current_answer': $('table#problem-info td:nth-child(4)').text(),
          'perfect': $('table#problem-info td:nth-child(5)').text(),
          'current_persent': $('table#problem-info td:nth-child(6)').text(),
          'subject': $('span#problem_title').text(),

          // multi_line
          'question': JSON.stringify(question),
          'input_info': JSON.stringify(input_info),
          'output_info': JSON.stringify(output_info),
          'input': JSON.stringify(input),
          'output': JSON.stringify(output),
          'original_source': JSON.stringify(original_source),
          'author': 1,
          'date': date
        };

        save_db(conn, key, crawled_data[key]);

        resolve(true);
      });
    });
    promise.push(req_promise);
  };

  for (; index < end; index++) {
    _loop();
  }
  Promise.all(promise).then(function (result) {
    callback(null, { data: crawled_data, result: result, promise: promise.length });
  }).catch(function (error) {
    callback(error);
  });
};

function clearLastBlank(arr) {
  var cleared = arr;
  cleared.map(function (item, index) {
    if (item[item.length - 1] === '') {
      cleared[index] = item.slice(0, -1);
    }
  });
  return cleared;
}

// 'https://www.acmicpc.net/problem/1000' ~
function making_url(url, index, end) {
  var converted = [];
  for (; index <= end; index++) {
    converted.push(url + index);
  }
  return converted;
};
function save_db(conn, key, data) {
  var fields = Object.keys(data),
      values = [];
  for (var _key in data) {
    values.push(data[_key]);
  }
  var sql = 'INSERT IGNORE INTO backjoon_questions (' + fields + ') VALUES (?)';
  conn.query(sql, [values], function (error, result) {
    if (error) throw error;
  });
}