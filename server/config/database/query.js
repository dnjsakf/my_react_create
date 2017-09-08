  // 전체이용자
module.exports.all = (questionNo)=>{ 
  return 'SELECT qNo as question, count(*) as count'
      + ' FROM battlecode.qState'
      + ( questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo )
      + ' GROUP BY qNo';
}

module.exports.perfect = (questionNo)=>{
  return 'SELECT qNo as question, result, count(*) as count'
      + ' FROM battlecode.qState'
      + ( questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo )
      + ' AND result = 100' 
      + ' GROUP BY qNo';
}

module.exports.language = (questionNo, language, perfect)=>{
  return 'SELECT qNo as question, language, count(*) as count'
      + ' FROM battlecode.qState'
      + ( questionNo === 'all' ? ' WHERE qNo IN ( SELECT no FROM battlecode.questions )' : ' WHERE qNo = ' + questionNo )
      + ( language === 'all' ? ' AND language IN ( \'java\', \'python\', \'c\' ) ' : ' AND language = "'+ language +'"' )
      + ( perfect === true ? ' AND result = 100' : '' )
      + ' GROUP BY qNo';
}
module.exports.copyQuestion = (tableName)=>{
  return 'INSERT INTO '+ tableName + '( question )'
      + ' ( SELECT no as question FROM battlecode.qusetion )';
}