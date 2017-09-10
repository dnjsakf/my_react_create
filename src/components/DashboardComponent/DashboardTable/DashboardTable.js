import React, { Component } from 'react';
import style from './DashboardTable.css';

import { Table, Pagination } from 'react-materialize';

import { convertTable } from './../../../utility/converter';

const DashboardTable = ( props )=>{
  if( typeof props.table === 'undefined' ) return null;
  if( props.table.records === 'INIT') return null;
  
  const options = { except: ['subject', 'sourceCode'] };
  const tables = convertTable(props.table.records, options);

  const existMaxPage = ( typeof props.table.maxPage === 'undefined' ? false : true );
  const maxPage = ( existMaxPage ? props.table.maxPage : 1 );

  return (
    <section className="DashboardTable">
      <div className="tables">
        <button onClick={ props.onFoldDashboard }>접기</button>
        <Table>
          <thead>
            { tables.headers }
          </thead>
          <tbody>
            { tables.rows }
          </tbody>
        </Table>
      </div>
      <div className="pages">
        <Pagination 
          items={ maxPage }
          activePage={1}
          maxButtons={ maxPage } 
          onSelect={ (page)=>{ props.onChangeDashboard('page-mode', page) } } />
      </div>
    </section>
  );
}

export default DashboardTable