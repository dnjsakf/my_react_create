import React, { Component } from 'react';
import TabMenuItem from '../TabMenuItem/TabMenuItem';
import style from './TabMenuWrapper.css';

const TabMenuWrapper = ( props )=>{
  // const titles = props.titles;
  const titles = ['Algorithm', 'MyAlgorithm', 'Detail'];

  console.log('[TabMenuWrapper]', props)
  return(
    <div className="TabMenuWrapper left-tab">
      <TabMenuItem
        menuTitles={ titles }
        getAlgorithm = { props.getAlgorithm }
      />
    </div>
  );
}

export default TabMenuWrapper