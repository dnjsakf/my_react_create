import React, { Component } from 'react';
import style from './DashboardTable.css';

import { Table, Pagination } from 'react-materialize';

import { convertTable } from './../../../utility/converter';

const DashboardTable = ( props )=>{
  if( typeof props.table === 'undefined' ) return null;
  if( props.table.records === 'INIT') return null;
  let options = {};
  if( props.isLogined && props.isMyAlgo ){
    options = {
      except: ['mNo','subject'],
      replace: {
        sourceCode: {
          onClick: props.onShowPopUP
        }
      } 
    }
  } else {
    options = {
      except: ['mNo','subject', 'sourceCode']
    }
  }
  
  const tables = convertTable(props.table.records, options);

  const existMaxPage = ( typeof props.table.maxPage === 'undefined' ? false : true );
  const maxPage = ( existMaxPage ? props.table.maxPage : 1 );

  return (
    <section className="DashboardTable animated bounceInRight">
      <div className="tables">
        {/* <button onClick={ props.onFoldDashboard }>접기</button> */}
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