import React, { Component } from 'react';
import update from 'react-addons-update';
import { connect } from 'react-redux';

import { userStateUpdateRequest } from '../actions/UserState';

import { HeaderWrapper } from '../components/HeaderComponent'; 
import { PopUpWrapper } from '../components/PopUpComponent';

class HeaderContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      popup:{
        visible: false,
        mode: 'undefined'
      }
    }
    this.popupModes = ['setting']

    this.handleShowPopUp = this.handleShowPopUp.bind(this);
    this.handleClosePopUp = this.handleClosePopUp.bind(this);

    this.handleSaveSetting = this.handleSaveSetting.bind(this);
  }

  handleShowPopUp( mode ){
    if( this.popupModes.indexOf(mode) === -1 ) return false;

    this.setState(
      update( this.state,
        {
          popup:{
            visible: { $set: true },
            mode: { $set: mode }
          }
        }
      )
    )
  }

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

  handleSaveSetting( event ){
    const editorTheme = document.querySelector('#editor-theme');
    const editorLanguage = document.querySelector('#editor-language');
    const editorFont = document.querySelector('#editor-font');
    const editorFontSize = document.querySelector('#editor-fontSize');
 
    const updateData = {
      username: this.props.user.username,
      theme: editorTheme.value,
      language: editorLanguage.value,
      font: editorFont.value,
      fontSize: editorFontSize.value
    }

    this.props.updateUserState('setting', updateData).then(()=>{
      this.props.onSession();
    });
  }

  componentWillReceiveProps(nextProps){
    console.log('[Header-Receive-Poprs]', nextProps.user);
  }

  render(){
    let popup = '';
    if( this.state.popup.visible === true ){
      popup = (
        <PopUpWrapper
          popup={ this.state.popup }
          defaultEditor={ this.props.user.editor }
        
          onSave={ this.handleSaveSetting }
          onClosePopUp={ this.handleClosePopUp }
        />
      )
    }

    return (
      <header className="HeaderContainer">
        { this.state.popup.visible === true && popup }
        <HeaderWrapper
          onShowPopUp={ this.handleShowPopUp }

          isLogined={ this.props.isLogined }
          username={ this.props.user.username }
          displayName={ this.props.user.displayName }
          onLogout={ this.props.onLogout }
          />
      </header>
    )
  }
}

const mapStateToProps = ( state )=>{
  return {
    update:{
      status: state.UserState.status,
    }
  }
}
const mapDispatchToProps = ( dispatch )=>{
  return {
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer);
