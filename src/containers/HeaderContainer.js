import React, { Component } from 'react';

import { HeaderWrapper } from '../components/HeaderComponent'; 

class HeaderContainer extends Component{
  render(){
    return (
      <HeaderWrapper 
        isLogined={ this.props.isLogined }
        username={ this.props.username }
        onLogout={ this.props.onLogout }
      />
    )
  }
}
export default HeaderContainer
