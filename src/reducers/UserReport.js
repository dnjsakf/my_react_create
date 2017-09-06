import {
  POST_USER_REOPRT_WAITING,
  POST_USER_REOPRT_SUCCESS,
  POST_USER_REOPRT_FAILURE
} from './actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT'
}

export default function UserReportReducer(state, action){
  if( typeof state === 'undefined' ) { state = initialState }

  switch( action.type ){
    case POST_USER_REOPRT_WAITING:
      return {
        ...state,
        status: 'WAITING'
      }

    case POST_USER_REOPRT_SUCCESS:
      return {
        ...state,
        status: 'SUCCESS'
      }

    case POST_USER_REOPRT_FAILURE:
      return {
        ...state,
        status: 'FAILURE'
      }
      
    default:
      return state;
  }
}