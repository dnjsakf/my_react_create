import {
  GET_NOTICE_WAITING,
  GET_NOTICE_SUCCESS,
  GET_NOTICE_FAILURE
} from './ActionTypes';
import axios from 'axios';

export function getNoticeRequest( page, count ){
  return (dispatch)=>{

    dispatch(getNoticeWaiting());
    
    return axios.get('/api/notice/list', {params: {page, count }})
        .then((response)=>{
          console.log('\n[action-get-notice-success]', response, '\n');
          dispatch(getNoticeSuccess(response.data.data));
        })
        .catch((error)=>{
          console.error('\n[action-get-notice-failure]', error.response.data.error, '\n');
          dispatch(getNoticeFailure(error.response.data.error));
        });
  }
}

export function getNoticeWaiting(){
  return {
    type: GET_NOTICE_WAITING
  }
}
export function getNoticeSuccess(data){
  return {
    type: GET_NOTICE_SUCCESS,
    data
  }
}
export function getNoticeFailure(error){
  return {
    type: GET_NOTICE_FAILURE,
    error
  }
}