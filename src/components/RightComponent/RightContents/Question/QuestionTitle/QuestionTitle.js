import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import style from './QuestionTitle.css';

const QuestionTitle = ( props )=>{
  console.log('[question-title]', props, props.subject)
  return(
    <Navbar className='QuestionTitle' brand={ `${props.no}  ${props.subject}` } right>
      <NavItem
        key={1}
        onClick={ ()=>{ props.onShowPopUP( 'report' ) } }>
        <a><Icon>bug_report</Icon></a>
      </NavItem>
      <NavItem 
        key={2} 
        onClick={ ()=>{ props.onAlgorithmSolve(props.no)} }>
        <a><Icon>border_color</Icon></a>
      </NavItem>
    </Navbar>
  );
}

export default QuestionTitle
