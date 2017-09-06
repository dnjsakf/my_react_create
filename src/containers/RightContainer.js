import React, { Component } from 'react';

import { browserHistory } from 'react-router';

import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

import { connect } from 'react-redux';
import { questionStateRequest } from '../actions/Algorithm';
import { userStateUpdateRequest } from '../actions/UserState';
import { 
  authPasswordCheckRequest, 
  authSessionRequest 
} from '../actions/Authorization';

import update from 'react-addons-update';

class RightContainer extends Component{
  constructor(props){
    super(props);

    this.state = {
      mypage: {
        isPwdChecked: false,
      },
      question: {
        dashboard:{
          isDashClicked: false,
          mode: 'challenger',
          page: 1,
          count: 10
        }
      }
    }

    this.modes = ['passwordCheck', 'infoUpdate', 'history' ];

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordCheck = this.handlePasswordCheck.bind(this);

    this.handleUpdateUserState = this.handleUpdateUserState.bind(this);
    this.handleDeleteUserState = this.handleDeleteUserState.bind(this);

    this.handleDashboard = this.handleDashboard.bind(this);
  }

  // 엔터키 입력
  handlePasswordChange( event ){
    if( event.which === 13 || event.keyCode === 13){
      this.handlePasswordCheck();
    }
  }

  // 비밀번호 확인
  handlePasswordCheck( event ){
    if( this.props.isLogined === false ) return false;
    if( this.props.user === 'UNKNOWN') return false;

    const password = document.querySelector('input.PasswordCheck[name=password]').value;
    if( typeof password === 'undefined' ) return false;

    this.props.passwordCheck( this.props.user.username, password);
  }

  handleUpdateUserState( event ){
    const displayName = document.querySelector('input.UserState[name=displayName]');
    // const password = document.querySelect('input.UserState[name=password]');
    
    if( this.props.isLogined === false ) return false;
    if( this.props.user === 'UNKNOWN') return false;
    if( typeof displayName === 'undefined' ) return false;
    if( displayName.value.length < 4) return false;
    
    const updateData = {
      username: this.props.user.username,
      displayName: displayName.value
    }
    this.props.updateUserState('default', updateData).then(()=>{
      const label = document.querySelector('input.UserState[name=displayName] + label');
      displayName.value = '';
      label.classList.remove('active');
      this.props.sessionCheck();
    });
  }

  handleDeleteUserState( event ){
    if( this.props.isLogined === false ) return false;
    if( this.props.user === 'UNKNOWN') return false;

    // TODO: action
  }
  
  handleDashboard( _dashboard, page ){
    if( typeof _dashboard ===  'undefined' ) return false;
    if( typeof this.props.content.no === 'undefined' ) return false;
  
    const dashboard = (_dashboard === 'page_mode' ? this.state.question.dashboard.mode : _dashboard );

    const count = this.state.question.dashboard.count;
    this.props.getQuestionState( this.props.content.no, dashboard, page, count ).then(()=>{
      const clicked = this.state.isDashClicked;
      this.setState(
        update( this.state, 
          {
            question:{
              dashboard:{
                isDashClicked: { $set: true },
                mode: { $set: dashboard }
              }
            }
          }
        )
      )
    });
  }

  componentWillReceiveProps(nextProps){
    const nextMenu = nextProps.menu.toLowerCase();
    switch( nextMenu ){
      case 'mypage':
        if( nextProps.pwdCheck.mode === 'passwordCheck' && nextProps.pwdCheck.status === 'SUCCESS' ){
          return this.setState(
            update( this.state, 
                {
                  mypage: { isPwdChecked: { $set: true }}
                }
              )
            );
        }
    }
  }
  
  componentWillUpdate(){
    console.log(this.props.user)
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
          // question-title
          menu={ this.props.menu }
          content={ this.props.content }
          onAlgorithmSolve={ this.props.onAlgorithmSolve }

          // question-title-report
          onShowPopUP={ this.props.onShowPopUp }
          
          // question-detail-dashboard
          isDashClicked={ this.state.question.dashboard.isDashClicked }
          questinoState={ this.props.question }
          onDashboard={ this.handleDashboard }

          // myPage-password-check
          onPasswordChange={ this.handlePasswordChange }
          onPasswordCheck={ this.handlePasswordCheck }
          passwordChecked={ this.state.mypage.isPwdChecked }

          // myPage-update||delete
          onUpdateUserState={ this.handleUpdateUserState }
          onDeleteUserState={ this.handleDeleteUserState }
        
          // all content
          user={ this.props.user }
          />
      </section>
    )
  }
}

const mapStateToProps = ( state )=>{
  return {
    pwdCheck:{
      status: state.Authorization.status,
      mode: state.Authorization.mode,
      passwordChecked: state.Authorization.checked,
    },
    update:{
      status: state.UserState.status,
    },
    question:{
      fields: state.RightContentControll.question.fields,
      state: state.RightContentControll.question.state
    },
  }
}
const mapDispatchToProps = ( dispatch )=>{
  return {
    passwordCheck: ( username, password )=>{
      return dispatch(authPasswordCheckRequest( username, password ));
    },
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    },
    sessionCheck: ()=>{
      return dispatch(authSessionRequest());
    },
    getQuestionState: ( questionNo, dashboard, page, count )=>{
      return dispatch(questionStateRequest(questionNo, dashboard, page, count));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightContainer);