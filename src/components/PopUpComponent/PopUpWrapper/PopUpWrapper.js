import React, { Component } from 'react';
import style from './PopUpWrapper.css';

import Setting from '../Setting/Setting';

const PopUpWrapper = ( props )=>{
  if( typeof props.popup === 'undefined') return null;
  if( props.popup.visible === false) return null;

  let popup = undefined;
  switch( props.popup.mode ){
    case 'setting':
      popup = (
        <Setting 
          defaultEditor={ props.defaultEditor }

          onSave={ props.onSave }
          onClosePopUp={ props.onClosePopUp }
        />
      );
      break;
    default:
      popup = (
        <a>Invalid mode</a>
      );
      break;
  }
  
  return (
    <section className="PopUpWrapper">
      { popup }
    </section>
  );
}

export default PopUpWrapper