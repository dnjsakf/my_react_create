import React, { Component } from 'react';
import { Table, Pagination } from 'react-materialize';
import { convertTable } from './../../../../../../utility/converter';

import style from './DashboardDetail.css';

const DashboardDetail = ( props )=>{
  if( typeof props.questionState !== 'object') return null;
  
  const tableItems = convertTable( props.questionState.state );

  return (
    <section className="DashboardDetail">
      <Pagination 
        items={ 20 }  // 으어어 이거 리미트도 설정해줘야되네
        activePage={1}
        maxButtons={8} 
        onSelect={ (page)=>{ props.onDashboard( 'page_mode' , page) } } />
      <Table>
        <thead>
          { tableItems.headers }
        </thead>
        <tbody>
          { tableItems.rows }
        </tbody>
      </Table>
    </section>
  );
}

export default DashboardDetail