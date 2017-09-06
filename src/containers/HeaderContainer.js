import React, { Component } from 'react';
import update from 'react-addons-update';

import { HeaderWrapper } from '../components/HeaderComponent'; 

class HeaderContainer extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <header className="HeaderContainer">
        <HeaderWrapper
          onShowPopUp={ this.props.onShowPopUp }

          isLogined={ this.props.isLogined }
          username={ this.props.user.username }
          displayName={ this.props.user.displayName }
          onLogout={ this.props.onLogout } />
      </header>
    )
  }
}

export default HeaderContainer;
