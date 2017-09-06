import React, { Component } from 'react';
import style from './Notice.css';

import { Row, Col, Button, Table } from 'react-materialize';

const Notice = ( props )=>{
  console.log(props.default)
  console.log(props.default)
  console.log(props.default)
  console.log(props.default)
  console.log(props.default)
  return (
    <section className="Notice">
      <Row className="header">
        <Col m={12} s={12}>
          토픽
        </Col>
      </Row>
      <Row className="content">
        <Col m={12} s={12}>
          <Table>
            <thead>
              <tr>
                <th>No</th>
                <th>Subject</th>
                <th>Author</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>No</td>
                <td>Subject</td>
                <td>Author</td>
                <td>Data</td>
              </tr>
            </tbody>
          </Table>
        </Col>
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

export default Notice