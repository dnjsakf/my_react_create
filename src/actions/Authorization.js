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
            console.log('[session-success]', response);
            dispatch(authSuccess('session', response.data ))
          })
          .catch((error)=>{
            console.error('[session-failure]', error);
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
            console.log('[login-success]', response);
            dispatch(authSuccess('login', response.data ))
          })
          .catch((error)=>{
            console.error('[login-failure]', error);
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
            console.log('[logout-success]', response);
            dispatch(authSuccess('logout', response.data ))
          })
          .catch((error)=>{
            console.error('[logout-failure]', error);
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
            console.log('[register-success]', response);
            dispatch( authSuccess('register', response.data ) );
          })
          .catch((error)=>{
            console.error('[register-failure]', error.response);
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
            console.log('[passwordCheck-success]', response);
            dispatch( authSuccess('passwordCheck', response.data ) );
          })
          .catch((error)=>{
            console.error('[passwordCheck-failure]', error);
            dispatch(authFailure('passwordCheck', false ) );
          })
  }
}


// 회원가입 성공 
export function authWaiting( mode ){
  switch( mode ){
    case 'session':
      return {
        mode: mode, 
        type: AUTH_SESSION_WAITING 
      }
    case 'login':
      return {
        mode: mode, 
        type: AUTH_LOGIN_WAITING 
      }
    case 'logout':
      return {
        mode: mode, 
        type: AUTH_LOGOUT_WAITING
      }
    case 'register':
      return {
        mode: mode, 
        type: AUTH_REGISTER_WAITING
      }
    case 'passwordCheck':
      return {
        mode: mode, 
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
        mode: mode,
        type: AUTH_SESSION_SUCCESS,
        user: data.user
      }
    case 'login':
      return { 
        mode: mode,
        type: AUTH_LOGIN_SUCCESS,
      }
    case 'logout':
      return { 
        mode: mode,
        type: AUTH_LOGOUT_SUCCESS,
      }
    case 'register':
      return { 
        mode: mode,
        type: AUTH_REGISTER_SUCCESS,
      }
    case 'passwordCheck':
      return { 
        mode: mode,
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
        mode: mode,
        type: AUTH_SESSION_FAILURE,
        error: error
      }
    case 'login':
      return { 
        mode: mode,
        type: AUTH_LOGIN_FAILURE,
        error: error
      }
    case 'logout':
      return { 
        mode: mdoe,
        type: AUTH_LOGOUT_FAILURE,
        error: error
      }
    case 'register':
      return { 
        mode: mode,
        type: AUTH_REGISTER_FAILURE,
        error: error
      }
    case 'passwordCheck':
      return { 
        mode: mode,
        type: AUTH_PASSWORD_CHECK_FAILURE,
        failure: error
      }
    default:
      return false;
  }
}
