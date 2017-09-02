import React, { Component } from 'react';
import { AuthWrapper } from '../components/AuthComponent';
import update from 'react-addons-update';

class AuthContainer extends Component{
  constructor(props){
    super(props);
    this.state = {
      mode: 'login',
      login: {
        username: '',
        password: '',
      },
      register: {
        usernmae: '',
        displayName: '',
        password: '',
        passwordCheck: '',
      }
    }

    this.defaultModes = ['login', 'register'];

    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleLoginEvent = this.handleLoginEvent.bind(this);
    this.handleRegisterEvent = this.handleRegisterEvent.bind(this);
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
    if( !(/[a-zA-Z0-9\-\_]@[a-zA-Z0-9\-\_].[a-zA-Z]{2,3}/.test( username ))) return false;
    
    if( typeof password !== 'string' ) return false;
    if( !(/[a-zA-Z0-9!@#$%]{6,12}/gm.test(password))) return false;
    
    console.log('login', username, password);
    this.setState(
      update(
        this.state,
        {
          login:{
            username: { $set: username },
            password: { $set: password }
          }
        }
      )
    )
  }

  handleRegisterEvent( event ){
    console.log( 'register-submit', event.target );
  }

  handleChange( event ){
    // 굳이 누를 때 마다 저장할 필요없이
    // login 눌렀을 때 보내버리면 되는거잖아?
  }

  // type은 다음에 mode로 replacement하자
  render(){
    return (
      <AuthWrapper 
        type={ this.state.mode }
        onChangeType={ this.handleChangeAuth }
        onLoginEvent={ this.handleLoginEvent }
        onRegisterEvent={ this.handleRegisterEvent }
        onChange={ this.handleChange }
      />
    )
  }
}
export default AuthContainer