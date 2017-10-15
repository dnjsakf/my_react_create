import React, { Component } from 'react';
import { Col, Card, Table, Button } from 'react-materialize';

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
    array.map((data, dataIndex)=>{
      caseTag.push(
        <tr key={ dataIndex } className={`case-${title}-${ caseIndex }`}>
          <td className={`case-${ caseIndex } no`}>{ dataIndex === 0 ? caseIndex+1 : null  }</td>
          <td className={`case-${ caseIndex } data`}>{ data }</td>
        </tr>
      );
    });

    testcaseWrapper.push(
      <Col key={3 + caseIndex} m={12} s={cols} className={ `${title.toLowerCase()}-wrapper` }>  
        <Card 
          className='input' 
          textClassName='black-text' 
          title={ "" /* title.toUpperCase() + "-" + (caseIndex + 1) */}>
          <Table key={ caseIndex } className={ `${title}case-${ caseIndex }` }>
          <thead>
            <tr>
              <th className="no" data-field="no">{title}</th>
              <th className="data" data-field="data">data</th>
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
  let existsReplace = {}

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

    if( typeof tableOption.replace !== 'undefined' ){
      existsReplace = tableOption.replace;
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
        value={ rowIndex }
        onClick={''/* ()=>{ existOnClick.records( rowIndex )} */}>
        {
          ((_fields, _row)=>{
            let cols = [];
            _fields.map((field, colIndex)=>{
              if( Object.keys(existsReplace).indexOf(field) > -1 && field === 'sourceCode' ){
                cols.push(
                  <td value={ rowIndex } 
                      key={ colIndex } >
                      { 
                        <button className="btn-compare"
                                onClick={
                                  (event)=>{ 
                                    const option = { 
                                      row: rowIndex,
                                      id: _row.no, 
                                      language: _row.language
                                    };
                                    existsReplace[field].onClick('compare', option);
                                  }
                                 }>
                          상세보기
                        </button>
                      }
                  </td>
                ); 
              } else {
                cols.push(
                  <td value={ rowIndex } 
                      key={ colIndex }>
                    {  _row[field] }
                  </td>
                ); 
              }
            });
            return cols;
          })(fields, row)
        }
      </tr>
    )
  });

  return { headers, rows }
}