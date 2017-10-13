import React, { Component } from 'react';
import style from './Register';

import { Row, Col, Input } from 'react-materialize';

const Register = ( props )=>{
  return (
    <form id="register-form">
      <Row>
        <Input 
          onChange={ props.onChange }
          name="username" 
          label="E-mail"
          s={6} />
        <Input 
          onChange={ props.onChange }
          name="displayName" 
          label="Nick-Name" 
          s={6} />
        <Input
          name="password" 
          type="password" 
          label="password" 
          s={6} />
        <Input 
          name="password-check" 
          type="password" 
          label="password check" 

          onKeyPress = { props.onKeyPressEnter }
          s={6} />
        </Row>
    </form>
  );
}

export default Register