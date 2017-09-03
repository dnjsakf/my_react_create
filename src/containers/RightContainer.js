import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

import { connect } from 'react-redux';
import { authPasswordCheckRequest } from '../actions/Authorization';

import update from 'react-addons-update';

class RightContainer extends Component{

  constructor(props){
    super(props);
    
    this.modes = ['passwordCheck', 'infoUpdate', 'history' ];

    this.onPasswordCheck = this.onPasswordCheck.bind(this);
  }

  onPasswordCheck(){
    if( this.props.isLogined === true ){
      const password = document.querySelector('input.PasswordCheck[name=password]').value;
      this.props.passwordCheck( this.props.username, password);
    }
  }

  render(){
    return (
      <section className="right-tab">
        <TabMenuWrapper
          menuTitles={ this.props.menuTitles }
          disableTitles={ this.props.disableTitles }
          onMenuClick={ this.props.onMenuClick }
        />
        <ContentsWrapper
          menu={ this.props.menu }
          content={ this.props.content }
          onAlgorithmSolve={ this.props.onAlgorithmSolve }

          onPasswordCheck={ this.onPasswordCheck }
          passwordChecked={ this.props.passwordChecked }
          />
      </section>
    )
  }
}

const mapStateToProps = (state)=>{
  return {
    status: state.Authorization.status,
    mode: state.Authorization.mode,
    passwordChecked: state.Authorization.result,
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    passwordCheck: ( username, password )=>{
      return dispatch(authPasswordCheckRequest(username, password));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightContainer);