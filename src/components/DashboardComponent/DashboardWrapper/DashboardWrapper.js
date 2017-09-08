import React, { Component } from 'react';
import { Collapsible, CollapsibleItem } from 'react-materialize';

import DashboardItem from './../DashboardItem/DashboardItem';

import style from './DashboardWrapper.css';

const DashboardWrapper = ( props )=>{
  if( typeof props.stats === 'undefined' ) return null;
  
  let items = [];
  Object.keys( props.stats ).map((key, index)=>{
    items.push(
      <DashboardItem
        key={ index }
        title={ key }
        count={ props.stats[key] }
        onChangeDashboard={ props.onChangeDashboard } 
        />
    )
  });

  return (
    <section className="DashboardWrapper">
      <div className="stats">
        { items }
      </div>
      <div className="tables">
        { props.children }
      </div>
    </section>
  );
}

export default DashboardWrapper