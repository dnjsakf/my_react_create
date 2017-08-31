import {
  GET_ALGORITHM_DATA,
  GET_ALGORITHM_LIST,
  GET_ALGORITHM_LIST_FAILURE,
  GET_ALGORITHM_LIST_SUCCESS,
  GET_ALGORITHM_DATA_FAILURE,
  GET_ALGORITHM_DATA_SUCCESS,
}from './ActionTypes';

import axios from 'axios';

export function algorithmRequestList(){
  return (dispatch)=>{
    console.log('[action-algo-list]')
    
    // 현재 상태를 waiting 상태로 변경
    dispatch(algorithmList());

    return axios.get('/api/data/algorithm/list',{})
          .then((response)=>{
            console.log('[algo-list-request]', response);
            dispatch( algorithmListSuccess(response.data.subjects));
          })
          .catch((error)=>{
            console.error('[algo-list-request]', error);
            dispatch( algorithmListFailure(error.response.data.error));
          });
  }  
};
export function algorithmRequestData( questionNo ){
  return (dispatch)=>{
    console.log('[action-algo-data]',  questionNo );

    // 현재 상태를 waiting 상태로 변경
    dispatch( algorithmData() );

    return axios.get('/api/data/algorithm/data/'+questionNo, { questionNo : questionNo })
          .then((response)=>{
            console.log('[algo-data-request]', response);
            dispatch( algorithmDataSuccess(response.data.question) );    // [qusetion] 서버에서 보내는 json
          })
          .catch((error)=>{
            console.error('[algo-data-request]', error);
            dispatch( algorithmDataFailure(error.response.data.error) ); // [error] 서버에서 보내는 json
          });
  }
}


export function algorithmData(){
  return {
    type: GET_ALGORITHM_DATA,
    content: 'algorithm',
  }
}
export function algorithmList(){
  return {
    type: GET_ALGORITHM_LIST,
    content: 'algorithm',
  }
};

export function algorithmListFailure(error){
  return {
    type: GET_ALGORITHM__LIST_FAILURE,
    error
  }
};
export function algorithmDataFailure(error){
  return {
    type: GET_ALGORITHM__DATA_FAILURE,
    error
  }
};

export function algorithmListSuccess(data){
  return {
    type: GET_ALGORITHM_LIST_SUCCESS,
    content: 'algorithm',
    data
  }
};
export function algorithmDataSuccess(data){
  return {
    type: GET_ALGORITHM_DATA_SUCCESS,
    content: 'algorithm',
    data
  }
};