import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import style from './QuestionTitle.css';

const QuestionTitle = ( props )=>{
  const questionOption = [
    (
      <NavItem
        key={1}
        href="#"
        onClick={ ()=>{ props.onShowPopUP( 'report' ) } }>
        <a><Icon className='QuestionReport'>bug_report</Icon></a>
      </NavItem>
    ),
    (
      <NavItem 
        key={2}
        href="#"
        onClick={ ()=>{ props.onAlgorithmSolve(props.no)} }>
        <a><Icon>border_color</Icon></a>
      </NavItem>
    )
  ];
  
  return(
    <Navbar className='white QuestionTitle'
            brand={ `${props.no}  ${props.subject}` }
            href="#"
            right>
            { props.isLogined ? questionOption : null }
    </Navbar>
  );
}

export default QuestionTitle
