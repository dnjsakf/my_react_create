import React, { Component } from 'react';
import { Row, Col, Card } from 'react-materialize';
import { DashboardDetail } from '../QuestionDashboard';
import {
  convertObjectToHtml, 
  convertTestcaseToHtml 
} from './../../../../../utility/converter';

import style from './QuestionDetail.css';

const QuestionDetail = ( props )=>{

  let content = '';
  if( props.isDashClicked === true ){
    content = (
      <DashboardDetail
        questionState={ props.questionState }
        onDashboard={ props.onDashboard }
      />
    )
  } else {
    let question = convertObjectToHtml(JSON.parse(props.content.text));
    let inputInfo = convertObjectToHtml(JSON.parse(props.content.input_info));
    let outputInfo = convertObjectToHtml(JSON.parse(props.content.output_info));
    let inputcase = convertTestcaseToHtml('input', JSON.parse(props.content.input));
    let outputcase = convertTestcaseToHtml('output', JSON.parse(props.content.output));
    content =(
      [
        <Col key={1} m={12} s={0} className='QuestionDetail-Content'>  
            <Card 
              className='blue-grey darken-1 content' 
              textClassName='white-text' 
              title='Question' >
              { question }
            </Card>  
        </Col>
        ,
        <Col key={2} m={12} s={0} className='QuestionDetail-InputInfo'>  
            <Card 
              className='blue-grey darken-1 input-info' 
              textClassName='white-text' 
              title='Input Info' >
              { inputInfo }
            </Card>  
        </Col>
        ,
        <Col key={3} m={12} s={0} className='QuestionDetail-OutputInfo'>  
            <Card 
              className='blue-grey darken-1 output-info' 
              textClassName='white-text' 
              title='Output Info' >
              { outputInfo }
            </Card>  
        </Col>
        ,
        <Col key={4} m={6} s={0} className='QuestionDetail-InputCase'>
          { inputcase }
        </Col>
        ,
        <Col key={5} m={6} s={0} className='QuestionDetail-OutputCase'>
          { outputcase }
        </Col>
      ]
    );
  }


  return (
    <Row className='QusetionDetail-scroll right'>
      { props.children }
      { content }
    </Row>
  );
}

export default QuestionDetail