import React, { Component } from 'react';

import { Card, Table } from 'react-materialize';

import style from './CompareState.css'

const CompareState = ( props )=>{
  return (
    <section className="CompareState">
      <Card key={0}
            className='blue-grey darken-1'
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
      <Card key={1}
            className='blue-grey darken-1'
            textClassName='white-text' 
            title={ "상세정보" } 
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
    </section>
  );
}

export default CompareState