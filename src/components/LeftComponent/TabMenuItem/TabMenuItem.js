import React, { Component } from 'react';
import style from './TabMenuItem.css'

import { Button } from 'react-materialize';

// props.menuTitles type is Array

const TabMenuItem = ( props )=>{
  let items = [];
  props.titles.map((item, index)=>{
    items.push(
      <li className="animated bounceInDown" key={index}>
        <Button 
          onClick={ ()=>{ props.onMenuClick('left', item)} } >
          { item }
        </Button>
      </li>
    );
  });
  
  return (
    <ul className="TabMenuItems left-tab">
      { items }
    </ul>
  )
}

export default TabMenuItem;
