import {
  AUTH_LOGIN_WAITING,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,

  AUTH_REGISTER_WAITING,
  AUTH_REGISTER_FAILURE,
  AUTH_REGISTER_SUCCESS
} from './ActionTypes';

export function authLoginRequest( username, password ){
  return ( dispatch )=>{

    // 상태 변경
    dispatch( authLoginWaiting() );
    
    return axios.post('/api/auth/login', { username, password })
          .then((response)=>{
            console.log('[login-success]', response);
            dispatch(authLoginSuccess( username ))
          })
          .catch((error)=>{
            console.error('[login-failure]', error);
            dispatch(authLoginFailure( error.response.data.error ));
          })
  }
}

export function authRegisterRequest( username, password, displayName ){
  return ( dispatch )=>{

    dispatch( authRegisterWaiting() );
    
    return axios.post('/api/auth/register', { username, password, displayName })
          .then((response)=>{
            console.log('[register-success]', response);
            dispach( authRegisterSuccess( username ) );
          })
          .catch((error)=>{
            console.error('[register-failure]', error);
            dispach( authRegisterSuccess( error.response.data.error ) );
          })
  }
}


// 회원가입 성공 
export function authLoginWaiting(){
  return {
    type: AUTH_LOGIN_WAITING,
  }
}
export function authLoginSuccess( username ){
  return {
    type: AUTH_LOGIN_SUCCESS,
    username
  }
}
export function authLoginFailure( error ){
  return {
    type: AUTH_LOGIN_FAILURE,
    error 
  }
}


// 회원가입 실패
export function authRegisterWaiting(){
  return {
    type: AUTH_REGISTER_WAITING,
  }
}
export function authRegisterSuccess( username ){
  return {
    type: AUTH_REGISTER_SUCCESS,
    username
  }
}
export function authRegisterFailure( error ){
  return {
    type: AUTH_REGISTER_FAILURE,
    error
  }
}