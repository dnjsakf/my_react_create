export function CheckType( obj ){
  if( typeof obj !== 'object') return false;

  const keys = Object.keys(obj);
  let checked = {};
  let types = [];
  
  keys.map((key, index)=>{
    types.push( typeof obj[key] );
    checked[key] = types[index];
  });
  return [checked, types];
}