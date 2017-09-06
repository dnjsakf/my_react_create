import {
  POST_USER_REOPRT_WAITING,
  POST_USER_REOPRT_SUCCESS,
  POST_USER_REOPRT_FAILURE
} from './ActionTypes';

import axios from 'axios';

export function insertUserReportRequest( report ){
  return ( dispatch )=>{
  
    dispatch(insertUserReportWaiting());

    return axios.post('/api/report/submit', report )
          .then((response)=>{
            console.log('[action-insert-report-success]', response);
            dispatch(insertUserReportSuccess());
          })
          .catch((error)=>{
            console.error('[action-insert-report-failure]', error);
            dispatch(insertUserReportFailure());
          });
  }
}

export function insertUserReportWaiting(){
  return {
    type: POST_USER_REOPRT_WAITING
  }
}
export function insertUserReportSuccess(){
  return {
    type: POST_USER_REOPRT_SUCCESS,
  }
}
export function insertUserReportFailure(){
  return {
    type: POST_USER_REOPRT_FAILURE,
  }
}
