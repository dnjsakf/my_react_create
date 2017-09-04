import {
  USERSTATE_INSERT_WAITING,
  USERSTATE_UPDATE_WAITING,
  USERSTATE_DELETE_WAITING,

  USERSTATE_INSERT_SUCCESS,
  USERSTATE_UPDATE_SUCCESS,
  USERSTATE_DELETE_SUCCESS,

  USERSTATE_INSERT_FAILURE,
  USERSTATE_UPDATE_FAILURE,
  USERSTATE_DELETE_FAILURE,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  error: 'INIT',
}

export default function UserState(state, action){
  if( typeof state === 'undefined' ){ state = initialState }

  switch( action.type ){
    case USERSTATE_INSERT_WAITING:
    case USERSTATE_UPDATE_WAITING:
    case USERSTATE_DELETE_WAITING:
      return update( state, 
        {
          status: { $set: 'WAITING' }
        }
      )

    case USERSTATE_INSERT_SUCCESS:
    case USERSTATE_UPDATE_SUCCESS:
    case USERSTATE_DELETE_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS'},
        }
      )
      
    case USERSTATE_INSERT_FAILURE:
    case USERSTATE_UPDATE_FAILURE:
    case USERSTATE_DELETE_FAILURE:
      return update( state, 
        {
          status: { $set: 'FAILURE' }
        }
      )
    default:
      return state;
  }
}