const mysql = require('mysql');
const query = require('./query');
const moment = require('moment');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ( process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode_stats'
});

conn.connect((error)=>{
  if( error ){
    console.error( error );
    throw error;
  } else {
    console.log('[mysql-connection] - config-mysql');
    
    console.log( process.env.NODE_ENV );
    if( process.env.NODE_ENV === 'development' ){
      updateQuestionDashboard();
    }
  }
});

function updateQuestionDashboard(){
  console.log( '[UPDATE-STATS-RUN]' );
  
  const challenger = searchChallenger( 'all' );
  const current = searchCurrent( 'all' );
  const perfect = searchPerfect( 'all' );
  const language = searchLanguage( 'all', 'all' );

  updateTable('total')
  .then(()=>{
    Promise.all([challenger, current, perfect, language])
    .then((result)=>{
      let total = {};
      result.map((item, index)=>{
        item.map((data)=>{
          if( typeof total[data.question] === 'undefined' ) {
            total[data.question] = {
              challenger: 0,
              current: 0,
              perfect: 0,
              c: 0,
              java: 0,
              python: 0
            };
          }
          total[data.question][data.data.mode] = data.data.count;
        });
      });
      // console.log('[Finish!!]');
      return total;
    })
    .then((total)=>{
      // console.log('[Start Total]\n', total);
      let promise = [];
      const questions = Object.keys(total);
      questions.map((question, index)=>{
        promise.push(
          new Promise((resolve, reject)=>{
            updateTotal( question, total[question], resolve, reject );
          })
        )
      });
      
      Promise.all(promise)
        .then((result)=>{
          console.log('[Finish Total]\n', result);
          // process.exit();
        })
        .catch(()=>{
          // process.exit();
        });
    })
    .catch((error)=>{
      console.log(error);
      // process.exit();
    });
  })
  .catch((error)=>{
    throw error;
  });
}
/**
 * 테이블에 question 번호 입력
 */
function updateTable(tablename){
  const update = query.update_table(tablename);
  return new Promise((resolve, reject)=>{
    conn.query( update, (error, result)=>{
      if( error ){
        reject({
          mode: 'update_table',
          result: error
        });
      } else {
        resolve({
          success: true
        });
      }
    });
  });
}
/**
 * 전체 통계
 */
function updateTotal( question, update, resolve, reject ){
  const sql = 'UPDATE total SET ? WHERE question = ?';
  conn.query(sql, [update ,question], (error, result)=>{
    if(error){
      reject({
        mode: 'total', 
        result: error 
      });
    }
    resolve({
      question: question,
      result: result.message
    });
  });
}

/**
 * 도전자
 */
function searchChallenger( questionNo ){
  return new Promise((resolve, reject)=>{
    const select = query.challenger( questionNo );
    conn.query( select, (error, result)=>{
      if(error) reject(error);

      // console.log( select );
      // console.log( result );
      
      let promise = [];
      const updateData = JSON.parse(JSON.stringify(result));
      updateData.map((data, index)=>{
        promise.push(
          new Promise((_resolve, _reject)=>{
            updateChallenger(data, _resolve, _reject);
          })
        )
      });
      Promise.all(promise)
        .then((result)=>{
          // console.log('[challenger]', result);
          let convert = {};
          result.map((item)=>{

          });
          resolve(result);
        })
        .catch(()=>{
          reject();
        });
    });
  });
}
function updateChallenger( data, resolve, reject ){
  const sql = 'UPDATE challenge SET challenger = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], (error, result)=>{
    if(error){
      reject({
        mode: 'challenger', 
        result: error 
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'challenger',
        count: data.count
      },
      result: result.message
    });
  });
}

/**
 * 정확도
 */
function searchCurrent( qusetionNo ){
  return new Promise((resolve, reject)=>{
    const select = query.current( qusetionNo );
    conn.query( select, (error, result)=>{
      if(error) reject(error);
      let promise = [];
      const updateData = JSON.parse(JSON.stringify(result));
      updateData.map((data, index)=>{
        promise.push(
          new Promise((_resolve, _reject)=>{
            updateCurrent(data, _resolve, _reject);
          })
        )
      });
      Promise.all(promise)
        .then((result)=>{
          // console.log('[current]', result);
          resolve(result);
        })
        .catch(()=>{
          reject();
        });
    });
  });
}
function updateCurrent( data, resolve, reject ){
  const sql = 'UPDATE challenge SET current = ? WHERE question = ? ';
  conn.query(sql, [data.avg, data.question], (error, result)=>{
    if(error){
      reject({
        mode: 'current', 
        result: error 
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'current',
        count: data.avg
      }, 
      result: result.message});
  });
}

/**
 * 만점자
 */
function searchPerfect( qusetionNo ){
  return new Promise((resolve, reject)=>{
    const select = query.perfect( qusetionNo );
    conn.query( select, (error, result)=>{
      if(error) reject(error);
      let promise = [];
      const updateData = JSON.parse(JSON.stringify(result));
      updateData.map((data, index)=>{
        promise.push(
          new Promise((_resolve, _reject)=>{
            updatePerfect(data, _resolve, _reject);
          })
        )
      });
      Promise.all(promise)
        .then((result)=>{
          // console.log('[perfect]', result);
          resolve(result);
        })
        .catch(()=>{
          reject();
        });
    });
  });
}
function updatePerfect( data, resolve, reject ){
  const sql = 'UPDATE challenge SET perfect = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], (error, result)=>{
    if(error){
      reject({
        mode: 'perfect', 
        result: error 
      });
    }
    resolve({
      question: data.question,
      data: {
        mode: 'perfect',
        count: data.count
      }, 
      result: result.message});
  });
}

/**
 * 사용언어
 * perfect: boolaen
 */

function searchLanguage( questionNo, language, perfect ){
  return new Promise((resolve, reject)=>{
    const select = query.language( questionNo, language, perfect );
    conn.query( select, (error, result)=>{
      if(error) reject(error);
      let promise = [];
      const updateData = JSON.parse(JSON.stringify(result));
      updateData.map((data, index)=>{
        promise.push(
          new Promise((_resolve, _reject)=>{
            updateLanguage(data, _resolve, _reject);
          })
        )
      });
      Promise.all(promise)
        .then((result)=>{
          // console.log('[lengauge]', result);
          resolve(result);
        })
        .catch(()=>{
          reject();
        });
    });
  });
}
function updateLanguage( data, resolve, reject ){
  const sql = 'UPDATE language SET ? WHERE question = ? ';
  let setting = {};
  setting[data.language] = data.count;

  conn.query(sql, [setting, data.question], (error, result)=>{
    if(error){
      reject({
        mode: data.language, 
        result: error
      });
    };
    resolve({
      question: data.question,
      data:{
        mode: data.language,
        count: data.count
      },
      result: result.message
    });
  });
}

module.exports.update = updateQuestionDashboard;

