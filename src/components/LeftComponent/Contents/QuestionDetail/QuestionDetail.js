import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'react-materialize';
import style from './QuestionDetail.css'

import {
  convertObjectToHtml,
  convertTestcaseToHtml
} from './../../../../utility/converter';

const QuestionDetail = ( props )=>{
  let question = convertObjectToHtml(JSON.parse(props.content.text));
  let inputInfo = convertObjectToHtml(JSON.parse(props.content.input_info));
  let outputInfo = convertObjectToHtml(JSON.parse(props.content.output_info));
  let inputcase = convertTestcaseToHtml('input', JSON.parse(props.content.input));
  let outputcase = convertTestcaseToHtml('output', JSON.parse(props.content.output));

  return (
    <Row className='QusetionDetail-scroll left'>
      <Col key={1} m={12} s={0} className='QuestionDetail-Content animated fadeInRight p3s'>  
          <Card 
            className='content' 
            textClassName='black-text' 
            title='Question' >
            { question }
          </Card>  
      </Col>
      <Col key={2} m={12} s={0} className='QuestionDetail-InputInfo animated fadeInRight p3s'>  
          <Card 
            className='input-info' 
            textClassName='black-text' 
            title='Input Info' >
            { inputInfo }
          </Card>  
      </Col>
      <Col key={3} m={12} s={0} className='QuestionDetail-OutputInfo animated fadeInRight p3s'>  
          <Card 
            className='output-info' 
            textClassName='black-text' 
            title='Output Info' >
            { outputInfo }
          </Card>  
      </Col>
      <Col key={4} m={6} s={0} className='QuestionDetail-InputCase animated fadeInRight p3s'>
        { inputcase }
      </Col>
      <Col key={5} m={6} s={0} className='QuestionDetail-OutputCase animated fadeInRight p3s'>
        { outputcase }
      </Col>
    </Row>
  );
}

export default QuestionDetail