import {
  AUTH_SESSION_WAITING,
  AUTH_LOGIN_WAITING,
  AUTH_LOGOUT_WAITING,
  AUTH_REGISTER_WAITING,
  AUTH_PASSWORD_CHECK_WAITING,
  
  AUTH_SESSION_SUCCESS,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGOUT_SUCCESS,
  AUTH_REGISTER_SUCCESS,
  AUTH_PASSWORD_CHECK_SUCCESS,
  
  AUTH_SESSION_FAILURE,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_FAILURE,
  AUTH_REGISTER_FAILURE,
  AUTH_PASSWORD_CHECK_FAILURE,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  isLogined: false,
  pwdChecked: false,
  user:{
    username: 'UNKNOWN EMAIL',
    displayName: 'UNKNOWN NAME',
    regDate: '2099-12-30'
  },
  error: 'INIT',
};

export default function Authorization(state, action){
  if( typeof state === 'undefined' ){ state = initialState; }
  switch( action.type ){
    /* WAITING */
    case AUTH_SESSION_WAITING:
    case AUTH_LOGIN_WAITING:
    case AUTH_LOGOUT_WAITING:
    case AUTH_REGISTER_WAITING:
    case AUTH_PASSWORD_CHECK_WAITING:
      return update( state, 
        {
          status: { $set: 'WAITING' },
        }
      );
    /* SUCCESSC */
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_REGISTER_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          isLogined: { $set: false }
        }
      );
    case AUTH_LOGIN_SUCCESS:
    case AUTH_SESSION_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          isLogined: { $set: true },
          user: { $set: action.user }
        }
      )
    case AUTH_PASSWORD_CHECK_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          pwdChecked: { $set: action.success }
        }
      );

    /* FAILURE */      
    case AUTH_SESSION_FAILURE:
    case AUTH_LOGIN_FAILURE:
    case AUTH_LOGOUT_FAILURE:
    case AUTH_REGISTER_FAILURE:
      return update( state, 
        {
          status: { $set: 'FAILURE' },
          isLogined: { $set: false },
          error: { $set: action.error }
        }
      );
    case AUTH_PASSWORD_CHECK_FAILURE:
      return update( state, 
        {
          status: { $set: 'FAILURE' },
          pwdChecked: { $set: action.failure }
        }
      );


    default:
      return state;
  }
}