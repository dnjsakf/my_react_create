import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  // const titles = props.titles;
  const titles = ['Home', 'detail', 'editor', 'mypage'];

  return(
    <div className="TabMenuWrapper right-tab">
      <TabMenuItem
        menuTitles={ titles }
      />
    </div>
  );
}

export default TabMenuWrapper