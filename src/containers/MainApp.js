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
  username: 'UNKNOWN'
}

class MainApp extends Component{
  constructor(props){
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  
  handleLogout(){
    if( this.props.isLogined === true ){
      this.props.logout( this.props.username );
    }
  }
  componentDidMount(){
    this.props.session();
  }
  
  render(){
    return (
      <section>
        <Header
          isLogined={ this.props.isLogined }
          username={ this.props.username }
          onLogout={ this.handleLogout }
        />
        <Section
          isLogined={ this.props.isLogined }
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
    username: state.Authorization.username
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    logout: ( username )=>{
      return dispatch(authLogoutRequest(username));
    },
    session: ()=>{
      return dispatch(authSessionRequest());
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp)