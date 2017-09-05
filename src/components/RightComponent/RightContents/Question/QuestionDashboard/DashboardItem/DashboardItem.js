import React, { Component } from 'react';
import style from './DashboardItem.css';

const DashboardItem = ( props )=>{
  return (
    <div className="DashboardItem"
         onClick={ ()=>{ props.onDashboard( props.title )} }>
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