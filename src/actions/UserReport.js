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
            console.log('[\naction-insert-report-success]', response, '\n');
            dispatch(insertUserReportSuccess());
          })
          .catch((error)=>{
            console.error('[\naction-insert-report-failure]', error.response.data.error, '\n');
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
