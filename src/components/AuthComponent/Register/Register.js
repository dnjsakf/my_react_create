import React, { Component } from 'react';
import './Register.css';

import { Row, Col, Input } from 'react-materialize';

const Register = ( props )=>{
  return (
    <form id="register-form">
      <Row>
        <Input 
          s={6}
          name="username" 
          label="E-mail"
          onBlur={ props.onCheckValid }
          onKeyPress = { props.onKeyPressEnter }/>
        <Input 
          s={6}
          name="displayName" 
          label="Nick-Name"
          onBlur={ props.onCheckValid }
          onKeyPress = { props.onKeyPressEnter }/>
        <Input
          s={6} 
          name="password" 
          type="password" 
          label="password" 
          onBlur={ props.onCheckValid }
          onKeyPress = { props.onKeyPressEnter }/>
        <Input 
          s={6}
          name="passwordCheck" 
          type="password" 
          label="password check" 
          onBlur={ props.onCheckValid }
          onKeyPress = { props.onKeyPressEnter }/>
        </Row>
    </form>
  );
}

export default Register