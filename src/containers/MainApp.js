import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { 
  authLogoutRequest, 
  authSessionRequest 
} from '../actions/Authorization'; 

import Header from './HeaderContainer';
import Section from './SectionContainer';

const defaultProps = {
  isLogined: false,
  username: 'main-UNKNOWN'
}

class MainApp extends Component{
  constructor(props){
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSession = this.handleSession.bind(this);
  }
  
  handleLogout(){
    if( this.props.isLogined === true ){
      this.props.logout( this.props.session.user.username );
    }
  }
  handleSession( event ){
    if( this.props.isLogined === true ){
      this.props.sessionCheck();
    }
  }


  componentDidMount(){
    this.props.sessionCheck();
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps.session)
  }
  
  render(){
    return (
      <section>
        <Header
          isLogined={ this.props.isLogined }
          user={ this.props.session.user }

          onLogout={ this.handleLogout }
          onSession={ this.handleSession }
        />
        <Section
          isLogined={ this.props.isLogined }
          user={ this.props.session.user }
        />
      </section>
    )
  }
}

MainApp.defaultProps = defaultProps;

const mapStateToProps = (state)=>{
  return {
    mode: state.Authorization.mode,
    isLogined: state.Authorization.isLogined,
    status: state.Authorization.status,
    session:{
      status: state.Authorization.status,
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