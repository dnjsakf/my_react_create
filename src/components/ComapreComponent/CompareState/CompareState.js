import React, { Component } from 'react';

import { Card, Table } from 'react-materialize';

import style from './CompareState.css'

const CompareState = ( props )=>{
  let analysised = null;
  if( typeof props.analysis.line !== 'undefined' ){
    analysised = (
      <Card key={1}
              className='blue-grey darken-1 detail'
              textClassName='white-text' 
              title={ "상세정보" } 
              actions={ props.handleCompare }>
            <Table>
              <thead>
                <tr>
                  <th>타입</th>
                  <th>코드</th>
                  <th>라인</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>line</td>
                  <td>{ props.analysis.line }</td>
                </tr>
                {
                  props.analysis.import.map((el,index)=>{
                    return (
                      <tr key={"import"+index}>
                        <td>import</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.define.class.map((el,index)=>{
                    return (
                      <tr key={"define-class"+index}>
                        <td>define-class</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.define.func.map((el,index)=>{
                    return (
                      <tr key={"define-func"+index}>
                        <td>define-function</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.used.class.map((el,index)=>{
                    return (
                      <tr key={"use-class"+index}>
                        <td>use-class</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.used.func.map((el,index)=>{
                    return (
                      <tr key={"use-func"+index}>
                        <td>use-function</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.used.condition.map((el,index)=>{
                    return (
                      <tr key={"use-condition"+index}>
                        <td>use-condition</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
                {
                  props.analysis.used.loop.map((el,index)=>{
                    return (
                      <tr key={"use-loop"+index}>
                        <td>use-loop</td>
                        <td>{el[1]}</td>
                        <td>{el[0]}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
        </Card>
    )
  }
  return (
    <section className="CompareState">
      <Card key={0}
            className='blue-grey darken-1 simple'
            textClassName='white-text' 
            title={ "기본정보" } 
            actions={ props.handleCompare }>
          <Table>
            <thead>
              <tr>
                <th>작성자</th>
                <th>작성언어</th>
                <th>점수</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{ props.state.name }</td>
                <td>{ props.state.language }</td>
                <td>{ props.state.result }</td>
                <td>{ props.state.date }</td>
              </tr>
            </tbody>
          </Table>
      </Card>
      { analysised }
    </section>
  );
}
export default CompareState