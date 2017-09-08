import React, { Component } from 'react';
import style from './DashboardTable.css';

import { Table, Pagination } from 'react-materialize';

import { convertTable } from './../../../utility/converter';

const DashboardTable = ( props )=>{
  if( typeof props.table === 'undefined' ) return null;
  if( props.table.records === 'INIT') return null;
  
  const options = {
    except: ['subject', 'sourceCode']  
  }
  const tables = convertTable(props.table.records, options)
  
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
          items={ 3 }  // 으어어 이거 리미트도 설정해줘야되네
          activePage={1}
          maxButtons={8} 
          onSelect={ (page)=>{ props.onChangeDashboard('page-mode', page) } } />
      </div>
    </section>
  );
}

export default DashboardTable