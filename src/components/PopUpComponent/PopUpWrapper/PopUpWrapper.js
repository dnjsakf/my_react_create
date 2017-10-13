import React, { Component } from 'react';
import style from './PopUpWrapper.css';

import Setting from './../Setting/Setting';
import Report from './../Report/Report';
import Notice from './../Notice/Notice';
import { CompareWrapper } from './../../ComapreComponent';

const PopUpWrapper = ( props )=>{
  if( typeof props.popup === 'undefined') return null;
  if( props.popup.visible === false) return null;

  let popup = undefined;
  switch( props.popup.mode ){
    case 'setting':
      popup = (
        <Setting 
          defaultEditor={ props.user.editor }

          onSave={ props.onSaveSetting }
          onClose={ props.onClosePopUp }
        />
      );
      break;
    case 'report':
      popup = (
        <Report
          default={ props.defaultReport }

          onSave={ props.onSaveReport }
          onClose={ props.onClosePopUp }
          />
      );
      break;
    case 'notice':
      popup = (
        <Notice
          default={ props.defaultNotice }
          info={ props.noticeInfo }
          
          onPage={ props.onPageNotice }
          onClose={ props.onClosePopUp }
          
          onPageNotice={ props.onPageNotice }
          onSelectNotice={ props.onSelectNotice }
          onBackNotice={ props.onBackNotice }
          />
      );
      break;
    case 'compare':
      popup = (
        <CompareWrapper
          option={ props.popup.option }
          onClose={ props.onClosePopUp }
          />
      )
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