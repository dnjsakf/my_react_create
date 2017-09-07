import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  console.log('[right-tab-menu-wrap]')

  return(
    <div className="TabMenuWrapper right-tab">
      <TabMenuItem
        menuTitles={ props.menuTitles }
        disableTitles={ props.disableTitles }
        onMenuClick={ props.onMenuClick }
      />
    </div>
  );
}

export default TabMenuWrapper