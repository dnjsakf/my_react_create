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

export function authSessionRequest( ){
  return ( dispatch )=>{
    
    // 상태 변경
    dispatch( authWaiting('session') );
    
    return axios.post('/api/auth/session')
          .then((response)=>{
            console.log('[session-success]', response);
            dispatch(authSuccess('session', response.data.username ))
          })
          .catch((error)=>{
            console.error('[session-failure]', error);
            dispatch(authFailure('session', error.response.data.error ));
          })
  }
}

export function authLoginRequest( username, password ){
  return ( dispatch )=>{

    // 상태 변경
    dispatch( authWaiting('login') );
    
    return axios.post('/api/auth/login', { username, password })
          .then((response)=>{
            console.log('[login-success]', response);
            dispatch(authSuccess('login', username ))
          })
          .catch((error)=>{
            console.error('[login-failure]', error);
            dispatch(authFailure('login', error.response.data.error ));
          })
  }
}

export function authLogoutRequest( username ){
  return ( dispatch )=>{
    
    // 상태 변경
    dispatch( authWaiting('logout') );

    return axios.post('/api/auth/logout',{ username })
          .then((response)=>{
            console.log('[logout-success]', response);
            dispatch(authSuccess('logout', username ))
          })
          .catch((error)=>{
            console.error('[logout-failure]', error);
            dispatch(authFailure('logout', error.response.data.error ));
          });
  }
}

export function authRegisterRequest( username, password, displayName ){
  return ( dispatch )=>{

    // 상태 변경
    dispatch( authWaiting('register') );
    
    return axios.post('/api/auth/register', { username, password, displayName })
          .then((response)=>{
            console.log('[register-success]', response);
            dispatch( authSuccess('register', username ) );
          })
          .catch((error)=>{
            console.error('[register-failure]', error.response);
            dispatch(authFailure('register', error.response.data.error ) );
          })
  }
}

export function authPasswordCheckRequest( username, password ){
  return ( dispatch )=>{
    
    dispatch( authWaiting('passwordCheck') );
    return axios.post('/api/auth/passwordCheck', { username, password })
          .then((response)=>{
            console.log('[passwordCheck-success]', response);
            dispatch( authSuccess('passwordCheck', true ) );
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
export function authSuccess( mode, username ){
  switch( mode ){
    case 'session':
      return { 
        mode: mode,
        type: AUTH_SESSION_SUCCESS,
        username: username,
      }
    case 'login':
      return { 
        mode: mode,
        type: AUTH_LOGIN_SUCCESS,
        username: username,
      }
    case 'logout':
      return { 
        mode: mode,
        type: AUTH_LOGOUT_SUCCESS,
        username: username
      }
    case 'register':
      return { 
        mode: mode,
        type: AUTH_REGISTER_SUCCESS,
        username: username
      }
    case 'passwordCheck':
      return { 
        mode: mode,
        type: AUTH_PASSWORD_CHECK_SUCCESS,
        success: username
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
