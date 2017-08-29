import React, { Component } from 'react';

import { Auth } from '../components/HeaderComponent/EventButton';
import { UserStateWrapper } from '../components/HeaderComponent/UserState'; 

class HeaderContainer extends Component{
  render(){
    return (
      <header className="main-header">
        <Auth
          isLogined={ true }/>
        <UserStateWrapper 
          isLogined={ true }
          displayName = "heodolf"
        />
      </header>
    )
  }
}
export default HeaderContainer