import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  // const titles = props.titles;
  const titles = ['menu1', 'menu2', 'menu3', 'menu3', 'menu3', 'menu3', 'menu3'];

  return(
    <div className="TabMenuWrapper">
      <TabMenuItem
        menuTitles={ titles }
      />
    </div>
  );
}

export default TabMenuWrapper