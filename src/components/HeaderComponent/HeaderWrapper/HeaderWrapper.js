import React, { Component } from 'react';
import { Navbar, NavItem, Icon, Button } from 'react-materialize';
import { Link } from 'react-router';

import style from './HeaderWrapper.css';

const HeaderWrapper = ( props )=>{
  const login = (
    <Link to="/login"><Icon >fingerprint</Icon></Link>
  );
  const logout = (
    <a onClick={ props.onLogout } ><Icon >vpn_key</Icon></a>
  )
  const UserItems = (
    [
    <NavItem key={1}>
      <a>{ props.displayName }</a>
    </NavItem>,
    <NavItem key={2}>
      <a
        onClick={ ()=>{props.onShowPopUp('setting')} }>
        <Icon>settings</Icon>
      </a>
    </NavItem>
    ]
  );
  return (
    <Navbar className='HeaderWrapper' brand='Battle-Code' right>
      { props.isLogined === true && UserItems }
      <NavItem key={3}>
        { props.isLogined === true ? logout : login }
      </NavItem>
    </Navbar>
  );
}

export default HeaderWrapper