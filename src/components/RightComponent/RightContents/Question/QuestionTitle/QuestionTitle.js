import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import style from './QuestionTitle.css';

const QuestionTitle = ( props )=>{
  console.log('[question-title]', props, props.subject)
  return(
    <Navbar className='QuestionTitle' brand={ `${props.no}  ${props.subject}` } right>
      <NavItem 
        key={1} 
        onClick={ ()=>{ props.onAlgorithmSolve(props.no)} }>
        <Icon>border_color</Icon>
      </NavItem>
    </Navbar>
  );
}

export default QuestionTitle
