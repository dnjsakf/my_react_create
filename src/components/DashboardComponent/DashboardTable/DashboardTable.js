import React, { Component } from 'react';
import style from './DashboardTable.css';

import { Table, Pagination } from 'react-materialize';

import { convertTable } from './../../../utility/converter';

const DashboardTable = ( props )=>{
  if( typeof props.table === 'undefined' ) return null;
  if( props.table.records === 'INIT') return null;
  
  const options = {
    except: ['subject', 'sourceCode'],
  }
  const tables = convertTable(props.table.records, options);

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
          items={ props.table.maxPage }
          activePage={1}
          maxButtons={ props.table.maxPage } 
          onSelect={ (page)=>{ props.onChangeDashboard('page-mode', page) } } />
      </div>
    </section>
  );
}

export default DashboardTable