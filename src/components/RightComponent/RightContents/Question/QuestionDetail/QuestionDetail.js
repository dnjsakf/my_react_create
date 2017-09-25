import React, { Component } from 'react';
import { Row, Col, Card } from 'react-materialize';
import {
  convertObjectToHtml, 
  convertTestcaseToHtml 
} from './../../../../../utility/converter';

import style from './QuestionDetail.css';

const QuestionDetail = ( props )=>{
  if( typeof props.content === 'undefined' ) return false;

  let content = '';
  let question = convertObjectToHtml(JSON.parse(props.content.text));
  let inputInfo = convertObjectToHtml(JSON.parse(props.content.input_info));
  let outputInfo = convertObjectToHtml(JSON.parse(props.content.output_info));
  let inputcase = convertTestcaseToHtml('input', JSON.parse(props.content.input));
  let outputcase = convertTestcaseToHtml('output', JSON.parse(props.content.output));
  content =(
    [
      <Col key={1} m={12} s={0} className='QuestionDetail-Content animated fadeInLeft p3s'>  
          <Card 
            className='blue-grey darken-1 content' 
            textClassName='white-text' 
            title='Question' >
            { question }
          </Card>  
      </Col>
      ,
      <Col key={2} m={12} s={0} className='QuestionDetail-InputInfo animated fadeInRight p3s'>  
          <Card 
            className='blue-grey darken-1 input-info' 
            textClassName='white-text' 
            title='Input Info' >
            { inputInfo }
          </Card>  
      </Col>
      ,
      <Col key={3} m={12} s={0} className='QuestionDetail-OutputInfo animated fadeInLeft p3s'>  
          <Card 
            className='blue-grey darken-1 output-info' 
            textClassName='white-text' 
            title='Output Info' >
            { outputInfo }
          </Card>  
      </Col>
      ,
      <Col key={4} m={6} s={0} className='QuestionDetail-InputCase animated fadeInLeft p3s'>
        { inputcase }
      </Col>
      ,
      <Col key={5} m={6} s={0} className='QuestionDetail-OutputCase animated fadeInRight p3s'>
        { outputcase }
      </Col>
    ]
  );

  return (
    <Row className='QusetionDetail-scroll right'>
      { props.children }
      { content }
    </Row>
  );
}

export default QuestionDetail