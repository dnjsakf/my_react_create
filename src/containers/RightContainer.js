import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

// Algoirhtm
import { 
  questionStateRequest,
  algorithmRequestData 
} from '../actions/Algorithm';
// Authorization
import { 
  authPasswordCheckRequest, 
  authSessionRequest 
} from '../actions/Authorization';
// UserState
import { 
  userStateUpdateRequest 
} from '../actions/UserState';


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
  
  // 대쉬보드 클릭 이벤트
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

  componentWillMount(){
    console.log('[right-will-mount]');
  }
  componentDidMount(){
    console.log('[right-did-mount]');
  }
  
  componentWillReceiveProps(nextProps){
    const nextMenu = nextProps.menu.toLowerCase();
    console.log('[right-receive]', nextMenu, nextProps.algorithmNo, nextProps.content.status);
    console.log('[right-receive]', nextProps.session.status);

    switch( nextMenu ){
      case 'mypage':
        if( nextProps.pwdCheck.status === 'SUCCESS' ){
          return this.setState(
            update( this.state, 
                {
                  mypage: { isPwdChecked: { $set: true }}
                }
              )
            );
        }
        break;
      case 'detail':
        if( nextProps.algorithmNo !== this.props.algorithmNo ){
          this.props.getAlgorithmData( nextProps.algorithmNo );
        }
        break;
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.content.status === 'WAITING' ) return false;
    if( nextProps.session.status === 'WAITING' ) return false;
    return true;
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
          content={ this.props.content.detail }
          onAlgorithmSolve={ this.props.onAlgorithmSolve }

          // question-title-report
          onShowPopUP={ this.props.onShowPopUp }
          
          // question-detail-dashboard
          isDashClicked={ this.state.question.dashboard.isDashClicked }
          questionState={ this.props.question }
          onDashboard={ this.handleDashboard }

          // myPage-password-check
          onPasswordChange={ this.handlePasswordChange }
          onPasswordCheck={ this.handlePasswordCheck }
          passwordChecked={ this.state.mypage.isPwdChecked }

          // myPage-update||delete
          onUpdateUserState={ this.handleUpdateUserState }
          onDeleteUserState={ this.handleDeleteUserState }
        
          // all content
          user={ this.props.session.user }
          />
      </section>
    )
  }
}

const mapStateToProps = ( state )=>{
  return {
    session:{
      status: state.Authorization.status,
      isLogined: state.Authorization.isLogined,
      user: state.Authorization.user
    },
    content:{
      status: state.RightContentControll.status,
      detail: state.RightContentControll.content
    },
    pwdCheck:{
      status: state.Authorization.status,
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
    getAlgorithmData: ( algorithmNo ) =>{
      return dispatch( algorithmRequestData( algorithmNo ) );
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