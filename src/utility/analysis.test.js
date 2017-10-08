export function analysis(language, source){
  switch( language.toLowerCase() ){
    case 'python':
      const run = analysisPython( source );
      
      const line = run.lines;
      const imports = run.imports();

      const defineClass = run.classes.define;
      const defineFunc = run.functions.define();
      
      const usedClass = run.classes.used();
      const condition = run.condition();
      const loop = run.loop();

      /** get index */
      const defineClassIndex = defineClass.map((el)=>{return el[0]});
      const usedClassIndex = usedClass.map((el)=>{return el[0]});
      const defineFuncIndex = defineFunc.map((el)=>{return el[0]});
      const conditionIndex = condition.map((el)=>{return el[0]});
      const loopIndex = loop.map((el)=>{return el[0]});
      const exceptIndexes = [].concat( 
        usedClassIndex,
        defineClassIndex,
        defineFuncIndex,
        conditionIndex, 
        loopIndex );

      const funcUsed = run.functions.used( exceptIndexes );

      /** store */
      const analysised = {
        line: line,
        import: imports,
        define: {
          class: defineClass,
          func: defineFunc
        },
        used:{
          class: usedClass,
          func: funcUsed,
          condition: condition,
          loop: loop
        }
      }

      return analysised;
    case 'java':
      // return analysisJava( source );
      return {};
    case 'c':
      // return analysisC( source );
      return {};
    default:
      return {};
  }
}
function analysisPython( source ){
  source = source.replace(/(?:\t+| +|)#.*/gm, '');
  let noStrSource = source.replace(/([\'\"\`]).*?(\1)/gm, '');

  const regClassesDefine = /^(\t+| +|)class ([\w]+)(.*):/gm;
  const analysised = {
    lines: source.split(/\r?\n/gm).length,
    imports: ()=>{
      const regex = /(?:(?:from )(.+))?(?:(?:import ))/;
      return noStrSource.split(/\r?\n/gm).reduce(
        ( prev, current, index )=>{
          if( index === 1 ){
            let save = [];

            if( regex.test(prev)) save.push( [0, [prev] ] );
            if( regex.test(current)) save.push( [1, [current] ] );
            
            return save;
          }
          if( regex.test(current)) prev.push( [index, [current] ] );

          return prev;
        }
      )
    },
    classes: {
      define: noStrSource.split(/\r?\n/gm).reduce(
        ( prev, current, index )=>{
          const currentExeced = regClassesDefine.exec( current );
          if( index === 1){
            let save = [];
            const prevExeced = regClassesDefine.exec( prev );
            
            if( prevExeced != null ) save.push( [ 0, prevExeced.slice(1,4) ] );
            if( currentExeced != null ) save.push( [ 1, currentExeced.slice(1,4) ] );
            
            return save;
          }
          if( currentExeced != null ) prev.push( [ index, currentExeced.slice(1,4) ] );
          return prev;
        }
      ),
      used: ()=>{
        const exceptLine = analysised.classes.define.map((el)=>{ return el[0]} );
        const classname = analysised.classes.define.map((el)=>{ return el[1][1]} ).join("|");
        const regex = new RegExp( "()("+classname+")(\\(.*?\\))" , "g" );
        return noStrSource.split(/\r?\n/gm).reduce(
          (prev, current, index )=>{
            const currentExeced = regex.exec( current );
            if( index === 1 ){
              let save = [];
              const prevExeced = regex.exec( prev );
              
              if( typeof exceptLine === 'object' && exceptLine.indexOf(0) > -1) return save;
              if( prevExeced !== null ) save.push( [0, prevExeced.slice(1,4)] );
              
              if( typeof exceptLine === 'object' && exceptLine.indexOf(1) > -1) return save;
              if( currentExeced !== null ) save.push( [1, currentExeced.slice(1,4)] );
              
              return save;
            }
            if( typeof exceptLine === 'object' && exceptLine.indexOf(index) > -1 ) return prev;
            if( currentExeced !== null ) prev.push( [index, currentExeced.slice(1,4)] );

            return prev;
          }
        );
      }
    },
    // [
    functions: {
      // 사용자 정의 함수
      define: ( exceptLine )=>{
        const regex = /(\t+| +|)def ([\w]+)(.*):/gm;
        return noStrSource.split(/\r?\n/gm).reduce( // filter should change to 'map'.
          ( prev, current, index )=>{
            const currentExeced = regex.exec( current );
            if( index === 1){
              let save = [];   
              const prevExeced = regex.exec( prev );

              if( typeof exceptLine === 'object' && exceptLine.indexOf(0) > -1 ) return save;
              if( prevExeced != null ) save.push( [ 0, prevExeced.slice(1,4) ] );
              
              if( typeof exceptLine === 'object' && exceptLine.indexOf(1) > -1 ) return save;
              if( currentExeced != null ) save.push( [ 1, currentExeced.slice(1,4) ] );
              
              return save;
            }
            if( typeof exceptLine === 'object' && exceptLine.indexOf(index) > -1 ) return prev;
            if( currentExeced != null ) prev.push( [ index, currentExeced.slice(1,4) ] );

            return prev;
          }
        )
      },
      // 일반 함수
      used:( exceptLine )=>{
        const space = /^(\t+| +)(.*)/m;
        return source.split(/\r?\n/gm).reduce(
          ( prev, current, index )=>{
            const currentExeced = space.exec( current );
            if( index === 1){
              let save = [];
              const prevExeced = space.exec( prev );

              if( typeof exceptLine === 'object' && exceptLine.indexOf(0) > -1 ) return save;
              if( checkBracket(prev) ) {
                save.push( ( prevExeced !== null ) ? [ 0, prevExeced.slice(1,3) ] : [ 0, [ '' , prev] ] );
              }

              if( typeof exceptLine === 'object' && exceptLine.indexOf(1) > -1 ) return save;
              if( checkBracket(current) ){
                save.push( ( currentExeced !== null ) ? [ 1, currentExeced.slice(1,3) ] : [ 1, [ '', current] ] );
              }

              return save;
            }
            if( typeof exceptLine === 'object' && exceptLine.indexOf(index) > -1 ) return prev;
            if( checkBracket(current) ){
              prev.push( ( currentExeced !== null ) ? [ index, currentExeced.slice(1,3) ] : [ index, [ '', current] ] );
            }
            return prev;
          }
        );
      },
    },
    // 반복문 : [ for, while ]
    loop: ( exceptLine )=>{
      const regLoop = /(\t+| +)(for .+|while .+):$/gm;
      return noStrSource.split(/\r?\n/gm).reduce(
        ( prev, current, index )=>{
          const currentExeced = regLoop.exec( current );
          if( index === 1){
            let save = [];
            const prevExeced = regLoop.exec( prev );
            
            if( typeof exceptLine === 'object' && exceptLine.indexOf(0) > -1 ) return save;
            if( prevExeced !== null ) save.push( [0, prevExeced.slice(1,3)] );
            
            if( typeof exceptLine === 'object' && exceptLine.indexOf(1) > -1 ) return save;
            if( currentExeced !== null ) save.push( [1, currentExeced.slice(1,3)] );
            
            return save;
          }
          if( typeof exceptLine === 'object' && exceptLine.indexOf(index) > -1 ) return prev;
          if( currentExeced !== null ) prev.push( [index, currentExeced.slice(1,3)] );
          
          return prev;
        }
      )
    },
    // 조건문 : [ if-else, if-elif-else ]
    condition: ( exceptLine )=>{
      const regCondition = /(\t+| +)(?:(if .+|elif .+|else)):$/gm;
      return noStrSource.split(/\r?\n/gm).reduce(
        ( prev, current, index )=>{
          const currentExeced = regCondition.exec(current);
          if( index === 1 ){
            let save = [];
            const prevExeced = regCondition.exec(prev);
            
            if( typeof exceptLine === 'object' && exceptLine.indexOf(0) > -1 ) return save;
            if( prevExeced != null ) save.push( [0, prevExeced.slice(1,3)] );
            
            if( typeof exceptLine === 'object' && exceptLine.indexOf(1) > -1 ) return save;
            if( currentExeced != null ) save.push( [1, currentExeced.slice(1,3)] );
            
            return save;
          }
          if( typeof exceptLine === 'object' && exceptLine.indexOf(index) > -1 ) return prev;
          if( currentExeced != null ) prev.push( [index, currentExeced.slice(1,3)] );
          
          return prev;
        }
      )
    },
    variable: ()=>{
      return 
    }
  }
  return analysised;
}
function analysisJava( source ){
  
}
function analysisC( Source ){

}

function checkBracket(line){
  let current, currentType;
  let stack = [];
  let toggle = ( line.indexOf('(') !== -1 || line.indexOf(')') !== -1 );

  for(let i = 0; i < line.length; i++){
    current = line[i];
    currentType = types(current);

    if( currentType < 0 )
    {
      stack.push( currentType );
    } 
    else if( currentType > 0 )
    {
      if( stack[stack.length-1]*(-1) === currentType )
      {
        stack = stack.slice(0, -1);
      }
    }
  }
  // return toggle && stack.length === 0;
  return toggle ;
}
function types(character){
  switch( character ){
    case '(': return -1;
    case '[': return -2;
    case '{': return -3;
    case ')': return 1;
    case ']': return 2;
    case '}': return 3;
  }
}

// // RUN
// const mysql = require('mysql');
// const conn = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'wjddns1',
//   database: 'battlecode'
// });
// const getData = (language)=>{
//   return new Promise((resolve, reject)=>{
//     const query = `SELECT language, sourceCode FROM qState WHERE language = "${language}" ORDER BY no DESC LIMIT 1`;
//     conn.query(query, (error, exist)=>{
//       if( error || exist.length === 0 ) reject( 'NOT FOUND' );
//       resolve(
//         {
//           language: exist[0].language,
//           source: exist[0].sourceCode
//         }
//       );
//     });
//   });
// }
// getData('python')
//   .then((result)=>{
//     const run = analysis( result.language, result.source );
//     console.log( run );
//     process.exit();
//   })
//   .catch((error)=>{
//     console.error( '[ERROR]\n');
//     process.exit();
//   });
