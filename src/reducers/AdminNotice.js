import {
  GET_NOTICE_WAITING,
  GET_NOTICE_SUCCESS,
  GET_NOTICE_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  notice: {
    list: [],
    count: 0
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
            list: { $set: action.data.data },
            count: { $set: action.data.count }
          }
        }
      )
    case GET_NOTICE_FAILURE:
      return update( state, 
        {
          status: 'FAILURE'
        }
      )
    default:
      return state;
  }
}