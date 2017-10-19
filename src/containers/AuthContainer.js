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
    this.RegExp={
      username: /^[a-zA-Z0-9\-\_]+@[a-zA-Z0-9\-\_]+?\.[a-zA-Z]{2,4}$/,
      password: /^[a-zA-Z0-9!@#$%]{6,12}$/,
      passwordCheck: /^[a-zA-Z0-9!@#$%]{6,12}$/,
      displayName: /^[a-zA-Z0-9가-힣]{3,8}$/,
    }
    this.defaultModes = ['login', 'register'];

    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleLoginEvent = this.handleLoginEvent.bind(this);
    this.handleRegisterEvent = this.handleRegisterEvent.bind(this);

    this.handleKeyPressEnter = this.handleKeyPressEnter.bind(this);

    this.handleCheckValid = this.handleCheckValid.bind(this);
  }

  handleCheckValid( event ){
    const targetName = event.target.name;
    if( this.RegExp[targetName].test( event.target.value ) ){
      // console.log(targetName, '[Correct]')
      event.target.nextElementSibling.classList.remove( 'incorrect' );
    } else {
      // console.log(targetName, '[Incorrect]')
      event.target.nextElementSibling.classList.add( 'incorrect' );
      return false;
    }
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
  
  handleLoginEvent(){
    const username = document.querySelector('input[name=username]');
    const password = document.querySelector('input[name=password]');
    
    if( typeof username.value !== 'string' ){
      username.focus();
      return false;
    }
    if( !(this.RegExp.username.test( username.value ))){
      username.focus();
      return false;
    }
    if( typeof password.value !== 'string' ){
      password.focus();
      return false;
    }
    if( !(this.RegExp.password.test( password.value ))){
      password.focus();
      return false
    };
    
    this.props.handleAuthLogin( username.value, password.value );
  }

  handleRegisterEvent(){
    const username = document.querySelector('input[name=username]');
    const password = document.querySelector('input[name=password]');
    const passwordCheck = document.querySelector('input[name=passwordCheck]');
    const displayName = document.querySelector('input[name=displayName]');
    
    if( typeof username.value !== 'string' ){
      username.focus();
      return false;
    }
    if( !(this.RegExp.username.test( username.value ))) {
      Materialize.toast('Error: username', 1000);
      username.focus();
      return false;
    }
    if( password.value !== passwordCheck.value ){
      Materialize.toast('Error: password', 1000);
      password.focus();
      return false;
    }
    if( typeof password.value !== 'string' ){
      Materialize.toast('Error: password', 1000);
      password.focus();
      return false;
    }
    if( !(this.RegExp.password.test(password.value))){
      Materialize.toast('Error: password', 1000);
      password.focus();
      return false;
    }
    if( typeof passwordCheck.value !== 'string' ){
      Materialize.toast('Error: password', 1000);
      passwordCheck.focus();
      return false;
    }
    if( !(this.RegExp.passwordCheck.test(passwordCheck.value))){
      Materialize.toast('Error: password', 1000);
      passwordCheck.focus();
      return false;
    }
    
    if( typeof displayName.value !== 'string' ){
      Materialize.toast('Error: nick-name', 1000);
      displayName.focus();
      return false;
    }
    if( !(this.RegExp.displayName.test( displayName.value ))){
      Materialize.toast('Error: nick-name', 1000);
      displayName.focus();
      return false;
    }
    
    this.props.handleAuthRegister( username.value, password.value, displayName.value ).then(()=>{
      Materialize.toast('가입성공', 1000);
      this.setState(
        update( this.state, 
          {
            mode: { $set: 'login' }
          }
        )
      )
    });
  }
  /**
   * LOGIN: username -> password -> LOGIN
   * REGISTER: username -> dispalyName-> password -> passwordChek -> REGISTER
   */
  handleKeyPressEnter( event ){
    if( event.which === 13 || event.keyCode === 13 ){
      if( this.state.mode === 'login' ){
        switch(event.target.name){
          case 'username':
            document.querySelector('input[name=password]').focus();
            return false;
          case 'password':
            return this.handleLoginEvent();
        }
      } else {
        switch(event.target.name){
          case 'username':
            document.querySelector('input[name=displayName]').focus();
            return false;
          case 'displayName':
            document.querySelector('input[name=password]').focus();
            return false;
          case 'password':
            document.querySelector('input[name=passwordCheck]').focus();
            return false;
          case 'passwordCheck':
            return this.handleRegisterEvent();
        }
      }
    } else {
      return false;
    }
  }
  componentWillReceiveProps(nextProps){
    if( this.state.mode === 'login' && nextProps.isLogined === true ){
      browserHistory.push('/');
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextState.mode === 'login' && nextProps.status === 'SUCCESS' ){
      console.log('[user]', nextProps.username );
      document.querySelector('input[name=username]').value = nextProps.username;
      document.querySelector('input[name=password]').focus();
    }
    return true;
  }

  // type은 다음에 mode로 replacement하자
  render(){
    return (
      <AuthWrapper 
        type={ this.state.mode }
        onCheckValid={ this.handleCheckValid }
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
    isLogined: state.Authorization.isLogined,
    status: state.Authorization.status,
    username: state.Authorization.user.username
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