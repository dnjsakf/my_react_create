import React, { Component } from 'react';
import style from './DashboardItem.css';

const DashboardItem = ( props )=>{
  if( typeof props.title === 'undefined' ) return null;
  if( typeof props.count === 'undefined' ) return null;
  
  const defaultPage = 1;
  return (
    <div className="DashboardItem"
         onClick={ ()=>{ props.onChangeDashboard( props.title, defaultPage)} }>
      <div className="item-name">
        <a>{ props.title }</a>
      </div>
      <div className="item-count">
        <div className="cycle">
          <a>{ props.count }</a>
        </div>
      </div>
    </div>
  );
}

export default DashboardItem

    // blue-grey darken-1
