import {
  GET_ALGORITHM_LIST,
  GET_ALGORITHM_FAILURE,
  GET_ALGORITHM_SUCCESS
}from './ActionTypes';

import axios from 'axios';

export function algorithmRequest(){
  return (dispatch)=>{
    console.log('[first-dispatch]')
    dispatch(algorithmList());

    return axios.get('/api/data/algorithm/list',{})
          .then((response)=>{
            console.log('[algorithm-request]', response);
            dispatch( algorithmRequestSuccess(response.data.subjects));
          })
          .catch((error)=>{
            console.error('[algorithm-request]', error);
            dispatch( algorithmRequestFailure(error.response.data.error));
          });
  }  
};
export function algorithmList(){
  return {
    type: GET_ALGORITHM_LIST,
  }
};

export function algorithmRequestFailure(error){
  return {
    type: GET_ALGORITHM_FAILURE,
    error
  }
};

export function algorithmRequestSuccess(data){
  return {
    type: GET_ALGORITHM_SUCCESS,
    data
  }
};