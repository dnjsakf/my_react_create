import React, { Component } from 'react';
import { Table } from 'react-materialize';

import style from './DashboardDetail.css';

const DashboardDetail = ( props )=>{
  if( typeof props.questinoState !== 'object') return null;
  
  const fields = props.questinoState.fields;
  const datas = props.questinoState.state;

  let headers = [];
  let rows = [];

  // set table header
  headers.push(
    <tr key={ 0 }>
      {
        (()=>{
          let cols = []; 
          fields.map((field, index)=>{
            cols.push(<th key={ index }>{ field }</th>);
          });
          return cols;
        })()
      }
    </tr> 
  )
  // set table rows
  datas.map((data, rowIndex)=>{
    rows.push(
      <tr key={ rowIndex }>
      {
        (()=>{
          let cols = [];
          Object.keys(data).map((key, colIndex)=>{
            cols.push(<td key={ colIndex }>{ data[key] }</td>);
          });
          return cols;
        })()
      }
      </tr>
    )
  });
  return (
    <section className="DashboardDetail">
      <Table>
        <thead>
          { headers }
        </thead>
        <tbody>
          { rows }
        </tbody>
      </Table>
    </section>
  );
}

export default DashboardDetail