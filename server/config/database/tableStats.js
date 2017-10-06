const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ( process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode_stats'
});

conn.connect(()=>{
  console.log('[mysql-connection] - config-mysql');
});

const tableNames=['member', 'notice', 'report', 'questions', 'qState'];

function updateCountRecord(){

  const promise = Promise.all([
    countTable('member'),
    countTable('notice'),
    countTable('report'),
    countTable('questions'),
    countTable('qState')
  ]);

  promise.then((result)=>{
    console.log('[promise-success]', result);
    try{
      const updated = ((_fields, _count)=>{
        let data = {};
        _fields.map((el, index)=>{
          data[el] = _count[index];
        });
        return data;
      })(tableNames, result);
      return updated;
    } catch(e){
      console.error(e);
      process.exit();
    }
  }).then(( updated )=>{
    updateCount(updated).then(( result )=>{
      console.log('updated completed');
      console.log(updated);
      console.log(result.message);
      process.exit();
    }).catch((error)=>{
      console.log( error );
      process.exit();
    });
  }).catch((error)=>{
    console.log('[promise-error]', error);
    process.exit();
  })
}
function countTable( tableName ){
  return new Promise((resolve, reject)=>{
    try{
      const sql = `SELECT count(*) AS count FROM battlecode.${tableName}`;
      conn.query(sql, (error, result)=>{
        if( error ) {
          reject(error)
        };
        resolve(result[0].count);
      });
    } catch(e){
      reject(e);
    }
  });
}
function updateCount( updated ){
  return new Promise((resolve, reject)=>{
    try{
      const sql = `UPDATE count_records SET ?`;
      conn.query( sql, [updated] ,(error, result)=>{
        if(error){
          reject(error);
        }
        resolve(result);
      });
    } catch(e){
      reject(e);
    }
  });
}

updateCountRecord();