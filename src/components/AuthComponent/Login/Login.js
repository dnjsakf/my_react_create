import React, { Component } from 'react';
import style from './Login.css';

import { Row, Input } from 'react-materialize';
 
const Login = ( props )=>{
  return (
    <form id="login-form">
      <Row>
        <Input 
          name="username" 
          onChange={ props.onChange } 
          label="E-mail" 
          s={12} />
        <Input 
          name="password" 
          onKeyPress={ props.onKeyPressEnter } 
          type="password" 
          label="password" 
          s={12} />
      </Row>
    </form>
  );
}

export default Login