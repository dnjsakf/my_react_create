import React, { Component } from 'react';
import style from './Report.css';

import { Row, Col, Button, Input } from 'react-materialize';

const Report = ( props )=>{

  const title = `${props.default.no}   ${props.default.subject}`;

  return (
    <section className="Report">
      <Row className="header">
        <nav>
          <div className="nav-wrapper">
            <a className="brand-logo">{ title }</a>
          </div>
        </nav>
      </Row>
      <Row className="content">
        <Row>
          <Input 
            id="user-report-type"
            s={12} 
            type='select' 
            label="신고 타입" 
            defaultValue='1'
            onChange={ handleChange } >
            <option value='1'>오타가 있어요</option>
            <option value='2'>문제가 잘못되었어요</option>
            <option value='3'>테스트 케이스가 이상해요</option>
            <option value='4'>기타</option>
          </Input>
        </Row>
        <Row>
          <div 
            className="input-field col s12">
            <textarea id="user-report-detail" className="materialize-textarea"></textarea>
            <label htmlFor="user-report-detail">Detail</label>
          </div>
        </Row>
      </Row>
      <Row className="buttons">
        <Col m={12} s={6}>
          <Button
            onClick={ props.onSave }>
            Save
          </Button>
          <Button
            onClick={ props.onClose }>
            Cancle
          </Button>
        </Col>
      </Row>
    </section>
  );
}

function handleChange( event ){
  console.log( event.target.value );
}

export default Report