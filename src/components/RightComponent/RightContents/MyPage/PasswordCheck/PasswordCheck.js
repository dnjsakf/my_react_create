import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';

const PasswordCheck = ( props )=>{
  return (
    <form id="login-form">
      <Row>
        <Input
          className="PasswordCheck"
          name="password" 
          onChange={ props.onChange } 
          type="password" 
          label="password" 
          s={6} />
      </Row>
      <Row>
        <input className='btn' onClick={ props.onPasswordCheck } type="button" value="submit"/>
      </Row>
    </form>
  );
}

export default PasswordCheck