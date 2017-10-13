import React, { Component } from 'react';
import { Row, Col, Input, Icon, Button, Modal } from 'react-materialize';

import './UserState.css'

const UserState = ( props )=>{
  let toggle = false;

  return (
    <section className="UserState">
      <Row>
        <Col key={0} s={6}>
          <Row key={1}>
            <Input 
              s={12}
              className="UserState username"
              name="username"
              label={ props.user.username }
              validate 
              disabled>
              <Icon>email</Icon>
            </Input>
          </Row>
          <Row key={2}>
            <Input 
              s={12} 
              className="UserState displayName"
              name="displayName"
              label={ props.user.displayName }
              validate>
              <Icon>account_circle</Icon>
            </Input>
          </Row>
          <Row key={4}>
            <Input 
              s={12} 
              className="UserState regDate"
              name="regDate"
              label={ props.user.regDate }
              validate
              disabled>
              <Icon>event_available</Icon>
            </Input>
          </Row>
          <Row key={5}>
            <Col s={6}>
              <Button 
                className="UserState btn-update"
                onClick={ props.onUpdateUserState }>
                Update
              </Button>
            </Col>
            <Col s={6}>
              <Button 
                className="UserState btn-delete"
                onClick={ props.onDeleteUserState }>
                Delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
}

export default UserState
