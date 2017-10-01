import React, { Component } from 'react';
import { Row, Col, Button, Table } from 'react-materialize';

import { 
  convertObjectToHtml, 
  convertTestcaseToHtml 
} from './../../../../../utility/converter';

import style from './CompileResult.css';

const CompileResult = ( props )=>{
  /**
   * 컴파일 결과 출력
   */
  let tbodys = [];
  if( props.result.success === true ){
    props.result.result.map((CASE, caseIndex)=>{
      tbodys.push(
        <tbody key={caseIndex}>
          {
            ((_caseIndex, _inputs, _outputs)=>{
              let row = [];
              _inputs.map((_row, _index)=>{
                row.push(
                  <tr key={_index}>
                    <td>{ _index === 0 ? (_caseIndex + 1) : null }</td>
                    <td>{ _row }</td>
                    <td>{ typeof _outputs[_index] !== 'undefined' ? _outputs[_index] : null }</td>
                  </tr>
                );
              });
              return row;
            })(caseIndex, CASE.input, CASE.output)
          }
        </tbody>
      )
    });
  } else if ( props.result.success === false ) {
    tbodys.push(
      <tbody key='error-body'>
        <tr key={'error-row'}>
          <td>1</td>
          <td> compile error </td>
          <td> { props.result.result } </td>
        </tr>
      </tbody>
    )
  }
  return (
    <Row className='CompileResult-scroll'>
      <Col key={0} m={6} s={0}>
        <Button
          onClick={ props.handleRunCompile }
          disabled={ props.compiling }>
          { props.compiling ? '컴파일중' : '제출' }
        </Button>
        <Button
          onClick={ props.handleSaveSource }
          disabled={ props.saving }>
          { props.saving ? '저장중' : '저장' }
        </Button>
      </Col>
      <Table>
        <thead>
          <tr>
            <th>Case</th>
            <th>Input</th>
            <th>result</th>
          </tr>
        </thead>
        { tbodys }
      </Table>
    </Row>
  );
}

export default CompileResult