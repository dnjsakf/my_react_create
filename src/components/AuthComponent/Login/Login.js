import React, { Component } from 'react';
import './Login.css';

import { Row, Input } from 'react-materialize';
 
const Login = ( props )=>{
  return (
    <form id="login-form">
      <Row>
        <Input 
          s={12}
          name="username" 
          label="E-mail"
          onBlur={ props.onCheckValid }
          onKeyPress={ props.onKeyPressEnter }
          />
        <Input 
          s={12}
          name="password" 
          type="password" 
          label="password" 
          onKeyPress={ props.onKeyPressEnter }
          onBlur={ props.onCheckValid } />
      </Row>
    </form>
  );
}

export default Login