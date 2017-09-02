import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import { Link } from 'react-router';

import style from './HeaderWrapper.css';

function test(event){
  location.href = '/login';
}
const HeaderWrapper = ( props )=>{
  return (
    <Navbar className='HeaderWrapper' brand='Battle-Code' right>
      <NavItem>
        <Link to="/login"><Icon >fingerprint</Icon></Link>
      </NavItem>
    </Navbar>
  );
}

export default HeaderWrapper