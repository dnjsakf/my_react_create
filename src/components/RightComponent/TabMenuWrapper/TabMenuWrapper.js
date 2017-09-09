import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  console.log('[right-tab-menu-wrap]');
  
  let showMenu = [];

  return(
    <div className="TabMenuWrapper right-tab">
      <TabMenuItem
        titles={ props.titles }

        onMenuClick={ props.onMenuClick }
      />
    </div>
  );
}

export default TabMenuWrapper