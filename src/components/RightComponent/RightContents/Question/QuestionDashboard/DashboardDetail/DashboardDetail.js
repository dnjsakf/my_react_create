import React, { Component } from 'react';
import { Table, Pagination } from 'react-materialize';

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
      <Pagination 
        items={ 20 }  // 으어어 이거 리미트도 설정해줘야되네
        activePage={1}
        maxButtons={8} 
        onSelect={ (page)=>{ props.onDashboard( 'page_mode' , page) } } />
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