import {
  COMPILE_PYTHON_WAITING,
  COMPILE_PYTHON_SUCCESS,
  COMPILE_PYTHON_FAILURE
} from './ActionTypes';

import axios from 'axios';

export function compilePythonRequest( questionNo, sourceCode ){
  return (dispatch)=>{
    //대기
    dispatch(compilePythonWaiting());
    
    return axios.post(`/api/compile/python/${questionNo}`, { sourceCode })
      .then((response)=>{
        console.log('[action-compile-python-success]', response);
        dispatch(compilePythonSuccess(response.data));
      })  
      .catch((error)=>{
        console.error('[action-compile-python-failure]', error);
        dispatch(compilePythonFailure(error.response.data.error));
      });
  };
}

export function compilePythonWaiting(){
  return {
    type: COMPILE_PYTHON_WAITING
  }
}
export function compilePythonFailure(error){
  return {
    type: COMPILE_PYTHON_FAILURE,
    error
  }
}
export function compilePythonSuccess(data){
  return {
    type: COMPILE_PYTHON_SUCCESS,
    data
  }
}