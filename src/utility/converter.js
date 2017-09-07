import React, { Component } from 'react';
import { Col, Card, Table } from 'react-materialize';

export function convertObjectToHtml(object){
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


export function convertTestcaseToHtml(title, testcase, isEditor){
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
          { isEditor === true ? (<td className="test" data-field="test"></td>) : null }
        </tr>
      );
    });

    testcaseWrapper.push(
      <Col key={3 + caseIndex} m={12} s={cols} className={ `${title.toLowerCase()}-wrapper` }>  
        <Card 
          className='blue-grey darken-1 input' 
          textClassName='white-text' 
          title={ title.toUpperCase() + "-" + (caseIndex + 1) }>
          <Table key={ caseIndex } className={ `${title}case-${ caseIndex }` }>
          <thead>
            <tr>
              <th className="no" data-field="no">no</th>
              <th className="data" data-field="data">data</th>
              { isEditor === true ? (<th className="test" data-field="test"><button> TEST </button></th>) : null }
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


export function convertTable( listData, tableOption ){
  if( typeof listData === 'undefined' ||
       typeof listData[0] === 'undefined' ) return false;

  // return varialbe
  let headers = [];
  let rows = [];

  let fields = Object.keys(listData[0]);
  const records = listData;

  // onClickOption이 있는지 확인
  let existOnClick = {
    headers: false,
    records: false
  }

  // 필요없는 필드 삭제
  if( typeof tableOption !== 'undefined' ){
    if( typeof tableOption.except !== 'undefined' ){
      tableOption.except.map(( exceptField, index)=>{
        const exceptIndex = fields.indexOf( exceptField );
        if( exceptIndex > -1 ){
          fields.splice( exceptIndex, 1 );
        }
      });
    }
    
    if( typeof tableOption.onClick !== 'undefined' ){
      Object.keys(tableOption.onClick).map(( type, index)=>{
        existOnClick[type] = tableOption.onClick[type];
      });
    }
  }

  // set table header
  headers.push(
    <tr key={ 0 }>
      {
        ((_fields)=>{
          let cols = []; 
          _fields.map((field, index)=>{
            cols.push(<th key={ index }>{ field }</th>);
          });
          return cols;
        })(fields)
      }
    </tr> 
  );

  // set table rows
  records.map((row, rowIndex)=>{
    rows.push(
      <tr 
        key={ rowIndex } 
        onClick={ existOnClick.records !== false && existOnClick.records }>
        {
          ((_fields, _row)=>{
            let cols = [];
            _fields.map((field, colIndex)=>{
              cols.push(<td value={row.no} key={ colIndex }>{ _row[field] }</td>);
            });
            return cols;
          })(fields, row)
        }
      </tr>
    )
  });

  return { headers, rows }
}