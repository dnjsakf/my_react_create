import {
  COMPILE_WAITING,
  COMPILE_SUCCESS,
  COMPILE_FAILURE
} from './ActionTypes';

import axios from 'axios';

export function compileRequest( language, questionNo, sourceCode ){
  return (dispatch)=>{
    //대기
    dispatch(compileWaiting());
    
    return axios.post(`/api/compile/${language}/${questionNo}`, { sourceCode })
      .then((response)=>{
        console.log(`[action-compile-${language}-success]`, response);
        dispatch(compileSuccess(response.data));
      })  
      .catch((error)=>{
        console.error(`[action-compile-${language}-failure]`, error);
        dispatch(compileFailure(error.response.data.error));
      });
  };
}

export function compileWaiting(){
  return {
    type: COMPILE_WAITING
  }
}
export function compileFailure(error){
  return {
    type: COMPILE_FAILURE,
    error
  }
}
export function compileSuccess(data){
  return {
    type: COMPILE_SUCCESS,
    data
  }
}