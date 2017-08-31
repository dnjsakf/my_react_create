import React, { Component } from 'react';
import { Row, Col, Card, Table } from 'react-materialize';

import style from './QuestionDetail.css';

function convertObjectToHtml(object){
  let converted = [];
  if(typeof object !== 'object') return 'error';
  Object.keys(object).map(function(key, index){
    let item = '';
    if((/<.*>/).test(object[key])){
      item = <div key={index} dangerouslySetInnerHTML={ {__html: object[key]} }></div>;
    } else {
      item = object[key]
    }
    converted.push(
      item
    );
  });
  return converted;
}


function convertTestcaseToHtml(title, testcase){
  const cols = ( title.toLowerCase() === 'input' ? 1 : 2);
  let testcaseWrapper = [];
  Object.keys(testcase).map(function(key, caseIndex){
    let caseTag = [];
    const array = typeof testcase[key] === 'string' ? [testcase[key]] : testcase[key];
    array.map((el, dataIndex)=>{
      const number = dataIndex + 1;
      caseTag.push(
        <tr key={ dataIndex } className={`case-${title}-${ caseIndex }`}>
          <td className={`case-${ caseIndex } no`}>{number}</td>
          <td className={`case-${ caseIndex } data`}>{el}</td>
          <td className={`case-${ caseIndex } result`}>0%</td>
        </tr>
      );
    });
    testcaseWrapper.push(
      <Col key={3 + caseIndex} m={12} s={cols} className={ `${title.toLowerCase()}-wrapper` }>  
        <Card 
          className='blue-grey darken-1 input' 
          textClassName='white-text' 
          title={ `${title.toUpperCase()}-${caseIndex+1}`  }>
          <Table key={ caseIndex } className={ `${title}case-${ caseIndex }` }>
          <thead>
            <tr>
              <th data-field="no">no</th>
              <th data-field="data">data</th>
              <th data-field="result">result</th>
            </tr>
          </thead>
          <tbody key={ caseIndex }>
            { caseTag }
          </tbody>
        </Table>
        </Card>  
      </Col>
    )
  });
  return testcaseWrapper; 
}

const QuestionDetail = ( props )=>{

  
  let question = convertObjectToHtml(JSON.parse(props.data.text));
  let inputInfo = convertObjectToHtml(JSON.parse(props.data.input_info));
  let outputInfo = convertObjectToHtml(JSON.parse(props.data.output_info));
  let inputcase = convertTestcaseToHtml('input', JSON.parse(props.data.input));
  let outputcase = convertTestcaseToHtml('output', JSON.parse(props.data.output));

  // inputcase = convertTestcaseToHtml('input', inputcase);
  // outputcase = convertTestcaseToHtml('output', outputcase);

  
  console.log(JSON.parse(props.data.input));  

  return (
    <Row className='QusetionDetail-scroll'>
      <Col key={1} m={12} s={0} className='QuestionDetail-Content'>  
          <Card 
            className='blue-grey darken-1 content' 
            textClassName='white-text' 
            title='Question' >
            { question }
          </Card>  
      </Col>
      <Col key={2} m={12} s={0} className='QuestionDetail-InputInfo'>  
          <Card 
            className='blue-grey darken-1 input-info' 
            textClassName='white-text' 
            title='Input Info' >
            { inputInfo }
          </Card>  
      </Col>
      <Col key={3} m={12} s={0} className='QuestionDetail-OutputInfo'>  
          <Card 
            className='blue-grey darken-1 output-info' 
            textClassName='white-text' 
            title='Output Info' >
            { outputInfo }
          </Card>  
      </Col>
      <Col key={4} m={6} s={0} className='QuestionDetail-InputCase'>
        { inputcase }
      </Col>
      <Col key={5} m={6} s={0} className='QuestionDetail-OutputCase'>
        { outputcase }
      </Col>
    </Row>
  );
}

export default QuestionDetail

/*
<Col key={4} m={6} s={1}>  
          <Card 
            className='blue-grey darken-1 input' 
            textClassName='white-text' 
            title='Input' >
            { inputcase }
          </Card>  
      </Col>
      <Col key={5} m={6} s={1}>  
          <Card 
            className='blue-grey darken-1 output' 
            textClassName='white-text' 
            title='Output' >
            { outputcase }
          </Card>  
      </Col>


*/