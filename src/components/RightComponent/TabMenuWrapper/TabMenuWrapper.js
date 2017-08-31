import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  console.log('right-tab-menu-wrap')
  const titles = ['Home', 'detail', 'editor', 'mypage'];

  return(
    <div className="TabMenuWrapper right-tab">
      <TabMenuItem
        menuTitles={ titles }
        changeRightTab={ props.changeRightTab }
      />
    </div>
  );
}

export default TabMenuWrapper