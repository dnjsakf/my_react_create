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
    console.log('[헤더 프롭스 받음]', this.props, nextProps);
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.status.session === 'WAITING' ) return false;
    
    const sessionChanged = ( this.props.session.isLogined !== nextProps.session.isLogined );
    console.log('[헤더 세션 변경]', sessionChanged, this.props.session.isLogined, nextProps.session.isLogined );
    if( sessionChanged ) return true;
    
    return false;
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
    status:{
      session: state.Authorization.status,
    },
    session:{
      isLogined: state.Authorization.isLogined,
      user: state.Authorization.user
    }
  }
}

export default connect(
  mapStateToProps
)(HeaderContainer);
