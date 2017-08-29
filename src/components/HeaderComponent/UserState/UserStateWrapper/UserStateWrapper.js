import Display from '../Display/Display';
import OptionSetting from '../OptionSetting/OptionSetting';

import React, { Component } from 'react';

const UserStateWrapper = ( props )=>{
  const logined = (
    <div className="user-handler">
      <OptionSetting
        onClick={props.handleOptionSetting}
      />
      <Display
        onClick={ props.handleMyPage }
        displayName={ props.displayName }
      />
    </div>
  )

  // degien
  // [img] displayName
  //
  console.log(props)
  return (
    <div>
      { props.isLogined ? logined : '' }
    </div>
  )
}

export default UserStateWrapper