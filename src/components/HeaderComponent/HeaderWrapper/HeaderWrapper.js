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

  return (
    <Navbar className='HeaderWrapper' brand='Battle-Code' right>
      <NavItem>
        { props.isLogined === true ? logout : login }
      </NavItem>
    </Navbar>
  );
}

export default HeaderWrapper