import React, { Component } from 'react';
import { Row, Col, Card, Button } from 'react-materialize';
import style from './CompileResult.css';
import { 
  convertObjectToHtml, 
  convertTestcaseToHtml 
} from './../../../../../utility/converter';

const CompileResult = ( props )=>{
  let inputcase = convertTestcaseToHtml('input', JSON.parse(props.inputcase), true);
  let outputcase = convertTestcaseToHtml('output', JSON.parse(props.outputcase), true);

  return (
    <Row className='CompileResult-scroll'>
      <Col key={0} m={12} s={0}>
        <Button
          onClick={ props.handleRunCompile }>
          TEST
        </Button>
      </Col>
      <Col key={4} m={6} s={0} className='CompileResult-InputCase'>
        { inputcase }
      </Col>
      <Col key={5} m={6} s={0} className='CompileResult-OutputCase'>
        { outputcase }
      </Col>
    </Row>
  );
}

export default CompileResult