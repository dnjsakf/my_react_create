import React, { Component } from 'react';
import { Row, Input, Button } from 'react-materialize';

import './PasswordCheck.css';

const PasswordCheck = ( props )=>{
  return (
    <section className="PasswordCheck">
      <Row>
        <Input
          onKeyPress={ props.onPasswordChange } 
          className="PasswordCheck"
          name="password" 
          type="password" 
          label="password" 
          s={6} />
      </Row>
      <Row>
        <Button
          onClick={ props.onPasswordCheck }>
          submit
        </Button>
      </Row>
    </section>
  );
}

export default PasswordCheck