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
        visible: false,
        mode: undefined,
        value: undefined
      }
    };
    
    this.popupModes = ['notice', 'setting', 'report', 'compare'];
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
  handleShowPopUp( mode, value ){
    if( this.popupModes.indexOf(mode) === -1 ) return false;
    this.setState(
      update( this.state,
        {
          popup:{
            visible: { $set: true },
            mode: { $set: mode },
            value: { $set: value }
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
    this.props.sessionCheck();
  }
  componentDidMount(){
    console.log('[main-did-mount]');
  }

  componentWillReceiveProps(nextProps){
    console.log('[메인 프롭스 받음]', this.props, nextProps);
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.status.session === 'WAITING' ) return false;

    const popupChanged = ( this.state.popup !== nextState.popup );
    console.log('[메인 팝업 변경]', popupChanged, this.state.popup, nextState.popup );
    if( popupChanged ) return true;
    
    const sessionChanged = ( this.props.session !== nextProps.session );
    console.log('[메인 세션 변경]', sessionChanged, this.props.session, nextProps.session );
    if( sessionChanged ) return true;
    
    console.log('[메인 업데이트 안함]');
    return false;
  }
  componentWillUpdate(){
    console.log('[메인 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[메인 업데이트 완료]');
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
    status:{
      session: state.Authorization.status,
    },
    session:{
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