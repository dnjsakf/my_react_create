import React, { Component } from 'react';
import { Row, Col, Input, Icon, Button } from 'react-materialize';
import style from './UserState.css'

const UserState = ( props )=>{
  return (
    <section className="UserState">
      <Row key={1}>
        <Input 
          s={6}
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
          s={6} 
          className="UserState displayName"
          name="displayName"
          label={ props.user.displayName }
          validate>
          <Icon>account_circle</Icon>
        </Input>
      </Row>
      {
        /**
         * TODO
         * other options
         */
       }
      <Row key={3}>
        <Input 
          s={6} 
          className="UserState regDate"
          name="regDate"
          label={ props.user.regDate }
          validate
          disabled>
          <Icon>event_available</Icon>
        </Input>
      </Row>
      <Row key={4}>
        <Col s={3}>
          <Button 
            className="UserState btn-update"
            onClick={ props.onUpdateUserState }>
            Update
          </Button>
        </Col>
        <Col s={3}>
          <Button 
            className="UserState btn-delete"
            onClick={ props.onDeleteUserState }>
            Delete
          </Button>
        </Col>
      </Row>
    </section>
  );
}

export default UserState
