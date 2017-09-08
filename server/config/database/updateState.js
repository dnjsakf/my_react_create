const mysql = require('mysql');
const query = require('./query');
const moment = require('moment');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'wjddns1',
  database: 'battlecode_stats'
});

conn.connect(()=>{
  console.log('[mysql-connection] - config-mysql');
});

function updateQuestionDashboard(){

  const all = new Promise((resolve, reject)=>{
    const select = query.all( 'all');
    conn.query( select, (error, result)=>{
      if(error){
        reject(error);
      };
      
      let promise = [];
      const updateData = JSON.parse(JSON.stringify(result));
      updateData.map((data, index)=>{
        promise.push(
          new Promise((_resolve, _reject)=>{
            updateAll(data, _resolve, _reject);
          })
        )
      });
      Promise.all(promise)
        .then((result)=>{
          let _promise = [];
          result.map((data, index)=>{
            _promise.push(
              new Promise((_resolve, _reject)=>{
                console.log( data. data );
                updatedTotal('challenger', data.data, _resolve, _reject)
              })
            );
          });
          Promise.all(_promise)
            .then((result)=>{
              resolve(result);
            })
            .catch((error)=>{
              reject(error);
            });
        })
        .catch(()=>{
          reject();
        });
    });
  });

  const perfect = new Promise((resolve, reject)=>{
    const select = query.perfect( 'all' );
    conn.query( select, (error, result)=>{
      if(error){
        reject(error);
      };
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
          let _promise = [];
          result.map((data, index)=>{
            _promise.push(
              new Promise((_resolve, _reject)=>{
                console.log( data. data );
                updatedTotal('perfect', data.data, _resolve, _reject)
              })
            );
          });
          Promise.all(_promise)
            .then((result)=>{
              resolve(result);
            })
            .catch((error)=>{
              reject(error);
            });
        })
        .catch(()=>{
          reject();
        });
    });
  });

  const language = new Promise((resolve, reject)=>{
    const select = query.language( 'all', 'all' );
    conn.query( select, (error, result)=>{
      if(error){
        reject(error);
      };
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
          let _promise = [];
          result.map((data, index)=>{
            _promise.push(
              new Promise((_resolve, _reject)=>{
                console.log( data. data );
                updatedTotal('language', data.data, _resolve, _reject)
              })
            );
          });
          Promise.all(_promise)
            .then((result)=>{
              resolve(result);
            })
            .catch((error)=>{
              reject(error);
            });
        })
        .catch(()=>{
          reject();
        });
    });
  });

  Promise.all([all, perfect, language])
    .then((result)=>{
      console.log(result);
      process.exit();
    })
    .catch((error)=>{
      console.log(error);
      process.exit();
    });
}

function updatedTotal( field, data, resolve, reject ){
  const sql = 'UPDATE total SET ? WHERE question = ?';
  let condition = {};
  if( field === 'language' ){
    condition[data.language] = data.count;
  } else {
    condition[field] = data.count;
  }
  conn.query(sql, [condition ,data.question], (error, result)=>{
    if(error){
      reject({mode: 'total', result: error });
    }
    resolve({mode: 'total', result: result.message});
  });
}

function updateAll( data, resolve, reject ){
  const sql = 'UPDATE challenge SET challenger = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], (error, result)=>{
    if(error){
      reject({mode: 'all', result: error });
    }
    resolve({mode: 'all', data, result: result.message});
  });
}

function updatePerfect( data, resolve, reject ){
  const sql = 'UPDATE challenge SET perfect = ? WHERE question = ? ';
  conn.query(sql, [data.count, data.question], (error, result)=>{
    if(error){
      reject({mode: 'perfect', result: error });
    }
    resolve({mode: 'perfect', data, result: result.message});
  });
}

function updateLanguage( data, resolve, reject ){
  const sql = 'UPDATE language SET ? WHERE question = ? ';
  let setting = {};
  setting[data.language] = data.count;

  conn.query(sql, [setting, data.question], (error, result)=>{
    if(error){
      reject({mode: 'langauge', result: result.message});
    };
    resolve({mdoe: 'language', data, result: result.message});
  });
}

updateQuestionDashboard();
