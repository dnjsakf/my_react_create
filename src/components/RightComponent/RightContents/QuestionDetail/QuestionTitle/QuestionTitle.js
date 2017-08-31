import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';

const QuestionTitle = ( props )=>{
  console.log('[question-title]', props, props.subject)
  return(
    <Navbar brand={ `${props.no}  ${props.subject}` } right>
      <NavItem key={1} href='get-started.html'><Icon>search</Icon></NavItem>
      <NavItem key={2} href='get-started.html'><Icon>view_module</Icon></NavItem>
      <NavItem key={3} href='get-started.html'><Icon>refresh</Icon></NavItem>
      <NavItem key={4} href='get-started.html'><Icon>more_vert</Icon></NavItem>
    </Navbar>
  );
}

export default QuestionTitle