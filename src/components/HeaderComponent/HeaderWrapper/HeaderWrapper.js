import React, { Component } from 'react';
import { Navbar, NavItem, Icon } from 'react-materialize';
import { Link } from 'react-router';

import style from './HeaderWrapper.css';

const HeaderWrapper = ( props )=>{
  const login = (
    <Link to="/login"><Icon >fingerprint</Icon></Link>
  );
  const logout = (
    <a onClick={ props.onLogout } ><Icon >vpn_key</Icon></a>
  )
  const displayName = (
    <span>{ props.displayName }</span>
  )
  return (
    <Navbar className='HeaderWrapper' brand='Battle-Code' right>
      <NavItem key={1}>
        { props.isLogined === true ? displayName : null }
      </NavItem>
      <NavItem key={2}>
        { props.isLogined === true ? logout : login }
      </NavItem>
    </Navbar>
  );
}

export default HeaderWrapper