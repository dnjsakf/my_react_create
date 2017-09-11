import {
  GET_NOTICE_WAITING,
  GET_NOTICE_SUCCESS,
  GET_NOTICE_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  notice: {
    records: [],
    maxPage: 0
  },
}

export default function AdminNoticeReducer(state, action){
  if( typeof state === 'undefined' ) { state = initialState }

  switch( action.type ){
    case GET_NOTICE_WAITING:
      return update( state, 
        {
          status: { $set: 'WAITING' }
        }
      )
    case GET_NOTICE_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          notice: {
            records: { $set: action.data.records },
            maxPage: { $set: action.data.maxPage }
          }
        }
      )
    case GET_NOTICE_FAILURE:
      return update( state, 
        {
          status: 'FAILURE',
          notice: { $set: initialState.notice }
        }
      )
    default:
      return state;
  }
}