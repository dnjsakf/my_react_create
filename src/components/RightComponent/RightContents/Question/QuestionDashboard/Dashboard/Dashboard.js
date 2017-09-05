import React, { Component } from 'react';

import DashboardItem from '../DashboardItem/DashboardItem';
import DashboardDetail from '../DashboardDetail/DashboardDetail';

import style from './Dashboard.css';
import { Row, Col } from 'react-materialize';

const Dashboard = ( props )=>{
  if( typeof props.dashboard === 'undefined' ) return null;
  if( typeof props.dashboard !== 'object') return null;

  let items = [];
  let titles = Object.keys(props.dashboard);
  titles.map((title, index)=>{
    items.push(
      <Col key={ index } s={2} className='grid-example'>
        <DashboardItem
          title={ title }
          count={ props.dashboard[title] }
          onDashboard={ props.onDashboard }
        />
      </Col>
    );
  });

  const detail = (
    <DashboardDetail />
  )
  
  return (
    <section className="Dashboard">
      <Row>
        { items }
      </Row>
    </section>
  );
}

export default Dashboard