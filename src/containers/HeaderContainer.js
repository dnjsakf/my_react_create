import React, { Component } from 'react';
import { HeaderWrapper } from '../components/HeaderComponent'; 

class HeaderContainer extends Component{
  constructor(props){
    super(props);

    this.state={
      isLogined: false,
      user:{
        no:'',
        email:'',
        name: '',
        regDate: '',
      }
    }
  }

  render(){
    return (
      <HeaderWrapper />
    )
  }
}
export default HeaderContainer



/*
  <header className="main-header">
    <Auth
      isLogined={ this.state.isLogined }/>
    <UserStateWrapper 
      isLogined={ this.state.isLogined }
      displayName = { this.state.isLogined ? this.state.user.name : undefined }
    />
  </header>
*/