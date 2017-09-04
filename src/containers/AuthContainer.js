import React, { Component } from 'react';
import { AuthWrapper } from '../components/AuthComponent';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import update from 'react-addons-update';

class AuthContainer extends Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      mode: 'login',
      username: ''
    };

    this.defaultModes = ['login', 'register'];

    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleLoginEvent = this.handleLoginEvent.bind(this);
    this.handleRegisterEvent = this.handleRegisterEvent.bind(this);

    this.handleKeyPressEnter = this.handleKeyPressEnter.bind(this);
  }
  
  handleChangeAuth( event ){
    const mode = event.target.value.toLowerCase();
    
    if( typeof mode === 'undefined') return false;
    if( this.defaultModes.indexOf(mode) === -1 ) return false;
    if( this.state.mode === mode ) return false;

    this.setState(
      update( this.state, 
        {
          mode: { $set: mode}
        }
      )
    );
  }
  
  handleLoginEvent( event ){
    const username = document.querySelector('input[name=username]').value;
    const password = document.querySelector('input[name=password]').value;

    // 패스워드는 나중에 해쉬로 저장하자.
    
    if( typeof username !== 'string' ) return false;
    if( !(/[a-zA-Z0-9\-\_]+@[a-zA-Z0-9\-\_]+.[a-zA-Z]{2,3}/.test( username ))) return false;
    
    if( typeof password !== 'string' ) return false;
    if( !(/[a-zA-Z0-9!@#$%]{6,12}/gm.test(password))) return false;
    
    this.props.handleAuthLogin( username, password );
  }

  handleRegisterEvent( event ){
    const username = document.querySelector('input[name=username]').value;
    const password = document.querySelector('input[name=password]').value;
    const passwordCheck = document.querySelector('input[name=password-check]').value;
    const displayName = document.querySelector('input[name=displayName]').value;

    // 패스워드는 나중에 해쉬로 저장하자.
    if( typeof username !== 'string' ) return false;
    if( (/[a-zA-Z0-9\-\_]+@[a-zA-Z0-9\-\_]+.[a-zA-Z]{2,3}/).test( username ) === false) return false;

    if( typeof password !== 'string' ) return false;
    if( (/[a-zA-Z0-9!@#$%]{6,12}/gm).test(password) === false) return false;
    if( password !== passwordCheck ) return false;
    
    if( typeof displayName !== 'string' ) return false;
    if( (/[a-zA-Z0-9가-힣]{4,8}/gm).test( displayName ) === false) return false;
    
    this.props.handleAuthRegister( username, password, displayName ).then(()=>{
      this.setState(
        update( this.state, 
          {
            mode: { $set: 'login' }
          }
        )
      )
    });
  }

  handleKeyPressEnter( event ){
    if( event.which === 13 || event.keyCode === 13 ){
      if( this.state.mode === 'login' ){
        this.handleLoginEvent();
      } else {
        this.handleRegisterEvent();
      }
    }
  }
  componentWillReceiveProps(nextProps){
    if( nextProps.mode === 'login' && nextProps.isLogined === true ){
      browserHistory.push('/');
    }
  }

  // type은 다음에 mode로 replacement하자
  render(){
    return (
      <AuthWrapper 
        type={ this.state.mode }
        onChangeType={ this.handleChangeAuth }
        onLoginEvent={ this.handleLoginEvent }
        onRegisterEvent={ this.handleRegisterEvent }
        onKeyPressEnter={ this.handleKeyPressEnter }
      />
    )
  }
}

import {
  authLoginRequest,
  authRegisterRequest
} from '../actions/Authorization'

const mapStateToProps = (state)=>{
  return {
    mode: state.Authorization.mode,
    isLogined: state.Authorization.isLogined,
    status: state.Authorization.status,
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    handleAuthLogin: ( username, password )=>{
      return dispatch( authLoginRequest( username, password ) );
    },
    handleAuthRegister: ( username, password, displayName )=>{
      return dispatch( authRegisterRequest( username, password, displayName ) );
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthContainer)