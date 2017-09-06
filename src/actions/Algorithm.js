import {
  GET_ALGORITHM_DATA_WAITING,
  GET_ALGORITHM_LIST_WAITING,
  GET_QUESTION_STATE_WAITING,

  GET_ALGORITHM_LIST_SUCCESS,
  GET_ALGORITHM_DATA_SUCCESS,
  GET_QUESTION_STATE_SUCCESS,

  GET_ALGORITHM_LIST_FAILURE,
  GET_ALGORITHM_DATA_FAILURE,
  GET_QUESTION_STATE_FAILURE
}from './ActionTypes';

import axios from 'axios';

/**
 * action: get Algorithm List
 */
export function algorithmRequestList(){
  return (dispatch)=>{
    // 현재 상태를 waiting 상태로 변경
    dispatch(algorithmListWaiting());

    return axios.get('/api/data/algorithm/list',{})
          .then((response)=>{
            console.log('[액션-algo-list-성공]', response);
            dispatch( algorithmListSuccess(response.data.subjects));
          })
          .catch((error)=>{
            console.error('[액션-algo-list-실패]', error);
            dispatch( algorithmListFailure(error.response.data.error));
          });
  }  
};
/**
 * action: get Algorithm Deatil Data
 */
export function algorithmRequestData( questionNo ){
  return (dispatch)=>{
    // 현재 상태를 waiting 상태로 변경
    dispatch( algorithmDataWaiting() );

    return axios.get('/api/data/algorithm/data/'+questionNo, { questionNo : questionNo })
          .then((response)=>{
            console.log('[액션-algo-data-성공]', response);
            dispatch( algorithmDataSuccess(response.data.question) );    // [qusetion] 서버에서 보내는 json
          })
          .catch((error)=>{
            console.error('[액션-algo-data-실패]', error);
            dispatch( algorithmDataFailure(error.response.data.error) ); // [error] 서버에서 보내는 json
          });
  }
}
/**
 * action: get Question State
 * example: no, subject, name, langauge, sourcecode, result, date
 */
export function questionStateRequest( questionNo, dashboard ){
  return (dispatch)=>{
    
    dispatch( qusetionStateWaiting() );

    return axios.get('/api/data/question/state', { params:{ questionNo, dashboard }} )
          .then((response)=>{
            console.log('[action-question-state-success]', response);
            dispatch( questionStateSuccess( response.data ) )
          })
          .catch((error)=>{
            console.log('[action-question-state-failure]', error);
            dispatch( questionStateFailure( error.response.data.error ) )
          });
  }
}

/**
 * WAITING
 */
export function algorithmDataWaiting(){
  return {
    type: GET_ALGORITHM_DATA_WAITING,
  }
}
export function algorithmListWaiting(){
  return {
    type: GET_ALGORITHM_LIST_WAITING,
  }
};
export function qusetionStateWaiting(){
  return {
    type: GET_QUESTION_STATE_WAITING,
  }
}

/**
 * FAILURE
 */
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
export function questionStateFailure(error){
  return {
    type: GET_QUESTION_STATE_FAILURE,
    error
  }
}

/**
 * SUCCESS
 */
export function algorithmListSuccess(data){
  return {
    type: GET_ALGORITHM_LIST_SUCCESS,
    data
  }
};
export function algorithmDataSuccess(data){
  return {
    type: GET_ALGORITHM_DATA_SUCCESS,
    data
  }
};
export function questionStateSuccess(data){
  return {
    type: GET_QUESTION_STATE_SUCCESS,
    data
  }
}