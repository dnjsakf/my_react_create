import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { HeaderWrapper } from '../components/HeaderComponent'; 

class HeaderContainer extends Component{
  constructor(props){
    super(props);
  }
  componentDidMount(){
    console.log('[header-mount]');
  }
  componentWillReceiveProps(nextProps){
    console.log('[header-receive]', nextProps.session.status);
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.session.status === 'WAITING' ) return false;
    return true;
  }

  render(){
    return (
      <header className="HeaderContainer">
        <HeaderWrapper
          onShowPopUp={ this.props.onShowPopUp }

          isLogined={ this.props.session.isLogined }
          username={ this.props.session.user.username }
          displayName={ this.props.session.user.displayName }

          onLogout={ this.props.onLogout } />
      </header>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    session:{
      status: state.Authorization.status,
      isLogined: state.Authorization.isLogined,
      user: state.Authorization.user
    }
  }
}

export default connect(
  mapStateToProps
)(HeaderContainer);
