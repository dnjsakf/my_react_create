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
    <NavItem key={1} href="#">
      <a className="valign-wrapper">
         { props.displayName }
      </a>
    </NavItem>,

    // popup-notice
    <NavItem key={2} href="#">
      <a className="valign-wrapper" 
         onClick={ ()=>{ props.onShowPopUp('notice')} }>
        <Icon>notifications</Icon>
      </a>
    </NavItem>,

    // popup-setting
    <NavItem key={3} href="#">
      <a className="valign-wrapper"
         onClick={ ()=>{ props.onShowPopUp('setting')} }>
        <Icon>settings</Icon>
      </a>
    </NavItem>
  ];
  return (
    <Navbar className='HeaderWrapper' brand='Battle-Code' href="#" right>
      { props.isLogined === true && UserItems }
      <NavItem key={4} href="#">
        { props.isLogined === true ? logout : login }
      </NavItem>
    </Navbar>
  );
}

export default HeaderWrapper