import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  console.log('[left-tab-menu-wrap]', props)
  return(
    <div className="TabMenuWrapper left-tab">
      <TabMenuItem
        titles={ props.titles }
        
        onMenuClick = { props.onMenuClick }
      />
    </div>
  );
}

export default TabMenuWrapper