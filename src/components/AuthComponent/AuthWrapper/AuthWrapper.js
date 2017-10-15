import React, { Component } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';

import { Button } from 'react-materialize';

import style from './AuthWrapper.css'

const AuthWrapper = ( props )=>{
  let authcontent = '';
  let authEventButton = '';
  switch( props.type ){
    case 'login':
      authcontent = (
        <Login onKeyPressEnter={ props.onKeyPressEnter }
               onCheckValid={ props.onCheckValid }
               />
      );
      authEventButton = ( 
        <Button 
          value="login"
          onClick={ props.onLoginEvent }>
          login
        </Button>
      );
      break;
    case 'register':
      authcontent = (
      <Register onKeyPressEnter={ props.onKeyPressEnter } 
                onCheckValid={ props.onCheckValid }
                /> 
      );
      authEventButton = ( 
        <Button 
          value="submit"
          onClick={ props.onRegisterEvent }>
          Register
        </Button>
      );
      break;
  }

  return (
    <section className="AuthWrapper">
      <div className="Auth-Change-Buttons">
        <Button className="toggle-login" value="login" onClick={ props.onChangeType }>login</Button>
        <Button className="toggle-register" value="register" onClick={ props.onChangeType }>Register</Button>
      </div>
      <div className="input-wrapper">
        <div className="Auth-Form">
          { authcontent }
        </div>
        <div className="Auth-Buttons">
          { authEventButton }
        </div>
      </div>
    </section>
  );
}

export default AuthWrapper