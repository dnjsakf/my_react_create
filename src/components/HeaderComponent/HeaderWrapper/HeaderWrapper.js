import React, { Component } from 'react';
import { Navbar, NavItem, Icon, Button } from 'react-materialize';
import { Link } from 'react-router';

import style from './HeaderWrapper.css';

const HeaderWrapper = ( props )=>{
  const login = (
    <Link to="/login"><Icon className='login-fingerprint'>fingerprint</Icon></Link>
  );
  const logout = (
    <a className="valign-wrapper" 
       href="#" 
       onClick={ props.onLogout }>
       <Icon>vpn_key</Icon>
    </a>
  )
  // array
  const UserItems = [
    <NavItem key={1}>
      <a className="valign-wrapper"
         href="#">
         { props.displayName }
      </a>
    </NavItem>,

    // popup-notice
    <NavItem key={2}>
      <a className="valign-wrapper" 
         href="#" 
         onClick={ ()=>{ props.onShowPopUp('notice')} }>
        <Icon >notifications</Icon>
      </a>
    </NavItem>,

    // popup-setting
    <NavItem key={3}>
      <a className="valign-wrapper"
         href="#" 
         onClick={ ()=>{ props.onShowPopUp('setting')} }>
        <Icon>settings</Icon>
      </a>
    </NavItem>
  ];
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