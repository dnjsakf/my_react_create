import {
  AUTH_LOGIN_WAITING,
  AUTH_LOGOUT_WAITING,
  AUTH_REGISTER_WAITING,

  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  AUTH_REGISTER_SUCCESS,
  
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_FAILURE,
  AUTH_REGISTER_FAILURE,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  mode: 'INIT',
  isLogined: false,
  status: 'INIT',
  result: 'INIT',
  error: 'INIT',
};

export default function Authorization(state, action){
  if( typeof state === 'undefined' ){ state = initialState; }
  switch( action.type ){
    /* WAITING */
    case AUTH_LOGIN_WAITING:
    case AUTH_LOGOUT_WAITING:
    case AUTH_REGISTER_WAITING:
      return update( state, 
        {
          status: { $set: 'WAITING' },
          mode: { $set: action.mode },
        }
      );
    /* SUCCESSC */
    case AUTH_LOGIN_SUCCESS:
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_REGISTER_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          isLogined: { $set: ( action.mode === 'login' ? true : false ) },
          mode: { $set: action.mode },
          username: { $set: action.username }
        }
      );
    /* FAILURE */      
    case AUTH_LOGIN_FAILURE:
    case AUTH_LOGOUT_FAILURE:
    case AUTH_REGISTER_FAILURE:
      return update( state, 
        {
          status: { $set: 'FAILURE' },
          isLogined: { $set: false },
          mode: { $set: action.mode },
          error: { $set: action.error }
        }
      );
    default:
      return state;
  }
}