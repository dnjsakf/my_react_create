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
} from './ActionTypes';
import axios from 'axios';

/**
 * Authorization Session Check Event
 */
export function authSessionRequest( ){
  return ( dispatch )=>{
    
    dispatch( authWaiting('session') );
    
    return axios.post('/api/auth/session')
          .then((response)=>{
            console.log('\n[action-session-success]', response , '\n');
            dispatch(authSuccess('session', response.data ))
          })
          .catch((error)=>{
            console.error('\n[action-session-failure]', error.response.data.error , '\n');
            dispatch(authFailure('session', error.response.data.error ));
          })
  }
}

/**
 * Authorization Login Event 
 */
export function authLoginRequest( username, password ){
  return ( dispatch )=>{

    // 상태 변경
    dispatch( authWaiting('login') );
    
    return axios.post('/api/auth/login', { username, password })
          .then((response)=>{
            console.log('\n[action-login-success]', response , '\n');
            dispatch(authSuccess('login', response.data ))
          })
          .catch((error)=>{
            console.error('\n[action-login-failure]', error.response.data.error , '\n');
            dispatch(authFailure('login', error.response.data.error ));
          })
  }
}

/**
 * Authorization logout Event 
 */
export function authLogoutRequest( username ){
  return ( dispatch )=>{
    
    // 상태 변경
    dispatch( authWaiting('logout') );

    return axios.post('/api/auth/logout',{ username })
          .then((response)=>{
            console.log('\n[action-logout-success]', response , '\n');
            dispatch(authSuccess('logout', response.data ))
          })
          .catch((error)=>{
            console.error('\n[action-logout-failure]',  error.response.data.error , '\n');
            dispatch(authFailure('logout', error.response.data.error ));
          });
  }
}

/**
 * Authorization Register Event 
 */
export function authRegisterRequest( username, password, displayName ){
  return ( dispatch )=>{

    // 상태 변경
    dispatch( authWaiting('register') );
    
    return axios.post('/api/auth/register', { username, password, displayName })
          .then((response)=>{
            console.log('\n[action-register-success]', response , '\n');
            dispatch( authSuccess('register', response.data ) );
          })
          .catch((error)=>{
            console.error('\n[action-register-failure]',  error.response.data.error , '\n');
            dispatch(authFailure('register', error.response.data.error ) );
          })
  }
}

/**
 * Authorization Password-Check Event 
 */
export function authPasswordCheckRequest( username, password ){
  return ( dispatch )=>{
    
    dispatch( authWaiting('passwordCheck') );
    return axios.post('/api/auth/passwordCheck', { username, password })
          .then((response)=>{
            console.log('\n[action-passwordCheck-success]',  response , '\n');
            dispatch( authSuccess('passwordCheck', response.data ) );
          })
          .catch((error)=>{
            console.error('\n[action-passwordCheck-failure]',  error.response.data.error , '\n');
            dispatch(authFailure('passwordCheck', false ) );
          })
  }
}


export function authWaiting( mode ){
  switch( mode ){
    case 'session':
      return {
        type: AUTH_SESSION_WAITING 
      }
    case 'login':
      return {
        type: AUTH_LOGIN_WAITING 
      }
    case 'logout':
      return {
        type: AUTH_LOGOUT_WAITING
      }
    case 'register':
      return {
        type: AUTH_REGISTER_WAITING
      }
    case 'passwordCheck':
      return {
        type: AUTH_PASSWORD_CHECK_WAITING
      }
    default:
      return false;
  } 
}

// 성공
export function authSuccess( mode, data ){
  switch( mode ){
    case 'session':
      return { 
        type: AUTH_SESSION_SUCCESS,
        user: data.user
      }
    case 'login':
      return { 
        type: AUTH_LOGIN_SUCCESS,
        user: data.user
      }
    case 'logout':
      return { 
        type: AUTH_LOGOUT_SUCCESS,
      }
    case 'register':
      return { 
        type: AUTH_REGISTER_SUCCESS,
      }
    case 'passwordCheck':
      return { 
        type: AUTH_PASSWORD_CHECK_SUCCESS,
        success: data.success  // 필요 없을듯
      }
    default:
      return false;
  }
}

// 실패
export function authFailure( mode, error ){
  switch( mode ){
    case 'session':
      return { 
        type: AUTH_SESSION_FAILURE,
        error: error
      }
    case 'login':
      return { 
        type: AUTH_LOGIN_FAILURE,
        error: error
      }
    case 'logout':
      return { 
        type: AUTH_LOGOUT_FAILURE,
        error: error
      }
    case 'register':
      return { 
        type: AUTH_REGISTER_FAILURE,
        error: error
      }
    case 'passwordCheck':
      return { 
        type: AUTH_PASSWORD_CHECK_FAILURE,
        failure: error
      }
    default:
      return false;
  }
}
