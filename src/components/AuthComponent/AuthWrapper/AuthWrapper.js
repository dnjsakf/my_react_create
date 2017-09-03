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
      authcontent = ( <Login onChange={ props.onChange } /> );
      authEventButton = ( 
        <Button 
          value="login"
          onClick={ props.onLoginEvent }>
          login
        </Button>
      );
      break;
    case 'register':
      authcontent = ( <Register onChange={ props.onChange } /> );
      authEventButton = ( 
        <Button 
          value="submit"
          onClick={ props.onRegisterEvent }>
          submit
        </Button>
      );
      break;
  }

  return (
    <section className="AuthWrapper">
      <div className="Auth-Change-Buttons">
        <Button className="deep-orange lighten-2" value="login" onClick={ props.onChangeType }>login</Button>
        <Button className="blue lighten-2" value="register" onClick={ props.onChangeType }>Register</Button>
      </div>
      <div className="Auth-Form">
        { authcontent }
      </div>
      <div className="Auth-Buttons">
        { authEventButton }
      </div>
    </section>
  );
}

export default AuthWrapper