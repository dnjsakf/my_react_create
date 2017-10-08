import React, { Component } from 'react';
import { Row, Col, Button } from 'react-materialize';

import style from './NoticeBoard.css';

const NoticeBoard = ( props )=>{
  return (
    <Row className="NoticeBoard animated p5s fadeInRight">
      {/* title is s1 */}
      <Col className="notice-title number" m={2} s={1} key={0} >
        <a>{ props.no }</a>
      </Col>
      <Col className="notice-title subject" m={6} s={1} key={1}>
        <a>{ props.subject }</a>
      </Col>
      <Col className="notice-title date" m={4} s={1} key={2}>
        <a>{ props.date }</a>
      </Col>
      {/* content is s2 */}
      <Col className="notice-content" m={12} s={2} key={3} >
        <p>{ props.content }</p>
      </Col>
      <Col className="notice-button" m={12} key={4}>
        <Button onClick={ props.onBackNotice }>뒤로가기</Button>
      </Col>
    </Row>
  );
}

export default NoticeBoard