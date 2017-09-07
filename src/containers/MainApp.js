import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { 
  authLogoutRequest, 
  authSessionRequest 
} from '../actions/Authorization'; 

import Header from './HeaderContainer';
import Section from './SectionContainer';
import PopUp from './PopUpContainer';

const defaultProps = {
  isLogined: false,
  username: 'main-UNKNOWN'
}

class MainApp extends Component{
  constructor(props){
    super(props);

    this.state = {
      popup:{
        mode: 'undefined',
        visible: false
      }
    };
    
    this.popupModes = ['notice', 'setting', 'report'];
    this.handleShowPopUp = this.handleShowPopUp.bind(this);
    this.handleClosePopUp = this.handleClosePopUp.bind(this);
    
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  handleLogout(){
    if( this.props.session.isLogined === true ){
      this.props.logout( this.props.session.user.username );
    }
  }

  // 팝업창 열기
  handleShowPopUp( mode ){
    if( this.popupModes.indexOf(mode) === -1 ) return false;
    this.setState(
      update( this.state,
        {
          popup:{
            visible: { $set: true },
            mode: { $set: mode },
          }
        }
      )
    )
  }
  // 팝업창 닫기
  handleClosePopUp( event ){
    event.preventDefault();
    this.setState(
      update( this.state,
        {
          popup:{
            visible: { $set: false },
          }
        }
      )
    )
  }

  componentWillMount(){
    console.log('[main-will-mount]');
  }
  componentDidMount(){
    console.log('[main-did-mount]');
    this.props.sessionCheck();
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.session.status === 'WAITING' ) return false;
    return true;
  }
  
  render(){
    const popup = (
      <PopUp 
        popup={ this.state.popup }
        onClosePopUp={ this.handleClosePopUp } />
    )

    return (
      <section>
        { this.state.popup.visible === true && popup}
        <Header
          onShowPopUp={ this.handleShowPopUp }
          onLogout={ this.handleLogout }
          />
        <Section
          onShowPopUp={ this.handleShowPopUp }
          />
      </section>
    );
  }
}

MainApp.defaultProps = defaultProps;

// question.state
const mapStateToProps = (state)=>{
  return {
    session:{
      status: state.Authorization.status,
      isLogined: state.Authorization.isLogined,
      user: state.Authorization.user
    }
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    logout: ( username )=>{
      return dispatch(authLogoutRequest(username));
    },
    sessionCheck: ()=>{
      return dispatch(authSessionRequest());
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp)