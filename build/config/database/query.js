'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Update battlecode_stats queries
 */
module.exports.challenger = function (questionNo) {
  return ['SELECT qNo as question, count(*) as count', 'FROM battlecode.qState', questionNo === 'all' ? 'WHERE qNo IN ( SELECT no FROM battlecode.questions )' : 'WHERE qNo = ' + questionNo, 'GROUP BY qNo'].join(' ');
};

module.exports.current = function (questionNo) {
  return ['SELECT qNo as question, result, avg(result) as avg', 'FROM battlecode.qState', questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo, 'GROUP BY qNo'].join(' ');
};

module.exports.perfect = function (questionNo) {
  return ['SELECT qNo as question, result, count(*) as count', 'FROM battlecode.qState', questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo, 'AND result = 100', 'GROUP BY qNo'].join(' ');
};

module.exports.language = function (questionNo, language, perfect) {
  return ['SELECT qNo as question, language, count(*) as count', 'FROM battlecode.qState', questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo, language === 'all' ? ' AND language IN ( \'java\', \'python\', \'c\' ) ' : ' AND language = "' + language + '"', perfect === true ? ' AND result = 100' : '', 'GROUP BY qNo, language'].join(' ');
};
module.exports.copyQuestion = function (tableName) {
  return ['INSERT INTO ' + tableName + '( question )', '( SELECT no as question FROM battlecode.qusetion )'].join(' ');
};

/**
 * dashboard mdoe = ['challenger', 'perfect', 'current' ,'c', 'java', 'python' ];
 * 1: the "challenger" is count that all record;
 * 2: the "perfect" is count that a result field value is 100;
 * 3: the "current" is persent that a result average;
 * 4: the "c" is count that a langauge field is 'c';
 * 5: the "java" is count that a langauge field is 'java';
 * 6: the "python" is count that a langauge field is 'python';
 */
module.exports.dashboard = function (mode, tables, conditions, sort) {
  if (typeof mode === 'undefined') return 'Undefined mode';
  if (typeof tables === 'undefined') return 'Undefined tables';
  if (typeof conditions === 'undefined') return 'Undefined conditions';
  if (typeof sort === 'undefined') sort = 'DESC';

  var mainTable = tables.main; // string
  var joinTable = tables.join; // array

  // set limit
  var count = typeof conditions.count === 'number' ? conditions.count : 10;
  var rows = typeof conditions.page === 'number' ? (conditions.page - 1) * count : 0;

  var extraCondition = true;
  var sorting = mainTable + '.no ' + sort;
  // set extraCondition
  switch (mode.toLowerCase()) {
    case 'current':
      sorting = mainTable + '.result ' + sort + ', ' + mainTable + '.no ' + sort;
      break;
    case 'perfect':
      extraCondition = mainTable + '.result = 100';
      break;
    case 'c':
    case 'java':
    case 'python':
      extraCondition = mainTable + '.language = "' + mode + '"';
      break;
    default:
      // nothing
      break;
  }
  // set query
  var query = [
  // SELECT 
  'SELECT', [mainTable + '.no as no', joinTable[0] + '.name as name', mainTable + '.language as language', mainTable + '.sourceCode as sourceCode', mainTable + '.result as result', mainTable + '.date as date'].join(', '),
  // FROM 
  'FROM ' + mainTable,
  // JOIN
  'INNER JOIN ' + joinTable[0] + ' ON ' + mainTable + '.mNo = ' + joinTable[0] + '.no',
  // conditions
  'WHERE', [mainTable + '.qNo = ' + conditions.qNo, extraCondition].join(' AND '), 'ORDER BY ' + sorting, 'LIMIT ' + rows + ', ' + count];
  return query.join(' '); // string
};
/**
 * get count query;
 */

// For table page...
module.exports.count = function (tableName, field, condition) {
  if (typeof tableName === 'undefined') return 'Undefined tableName';
  var existField = typeof field === 'undefined' ? false : true;
  var existCondition = typeof condition === 'undefined' ? false : true;
  /**
   * Check Valid
   */
  if (typeof tableName !== 'string') {
    return 'Type Error: tableName type is "string"';
  }
  if (existField && typeof field !== 'string') {
    return 'Type Error: field type is "string"';
  }
  if (existCondition && (typeof condition === 'undefined' ? 'undefined' : _typeof(condition)) !== 'object') {
    return 'Type Error: condition type is "object"';
  }
  /**
   * option For Dashboard
   */
  var extraCondition = true;
  if (existCondition) {
    if (typeof condition.language !== 'undefined') {
      switch (condition.language) {
        case 'c':
        case 'java':
        case 'python':
          extraCondition = 'language = "' + condition.language + '"';
          break;
        default:
          // ToDo
          break;
      }
    }
  }
  var query = [];
  if (existField) {
    query.push('SELECT ' + field + ', count(*) as count');
  } else {
    query.push('SELECT count(*) as count');
  }

  query.push('FROM ' + tableName);

  if (existCondition) {
    query.push('WHERE', ['qNo = ' + condition.qNo, extraCondition].join(' AND '));
  }
  if (existField) {
    query.push('GROUP BY ' + field);
  }

  return query.join(' ');
};