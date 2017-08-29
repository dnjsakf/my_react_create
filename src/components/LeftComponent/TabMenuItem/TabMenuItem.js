import React, { Component } from 'react';
import style from './TabMenuItem.css'

// props.menuTitles type is Array

const TabMenuItem = ( props )=>{
  let items = [];
  props.menuTitles.map((item, index)=>{
    console.log(item)
    items.push( <li  key={index}> { item } </li> );
  });
  console.log(items)
  
  return (
    <ul className="TabMenuItems">
      { items }
    </ul>
  )
}

export default TabMenuItem