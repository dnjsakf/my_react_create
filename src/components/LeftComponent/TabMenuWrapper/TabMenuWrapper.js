import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  // const titles = props.titles;
  const titles = ['Algorithm', 'MyAlgorithm', 'Detail'];

  console.log('[left-tab-menu-wrap]', props)
  return(
    <div className="TabMenuWrapper left-tab">
      <TabMenuItem
        menuTitles={ titles }
        changeLeftTab = { props.changeLeftTab }
      />
    </div>
  );
}

export default TabMenuWrapper