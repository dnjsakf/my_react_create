import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import update from 'react-addons-update';

import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

// Algoirhtm
import { 
  algorithmRequestData,
  questionStateRequest
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

    this.default={
      sort: 'DESC'
    }
    this.state={
      question: {
        no: 0,
      },
      dashboard:{
        visible: false,
        mode: "challenger",
        page: 1,
        count: 10,
        sort: 'ASC'
      }
    }

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordCheck = this.handlePasswordCheck.bind(this);

    this.handleUpdateUserState = this.handleUpdateUserState.bind(this);
    this.handleDeleteUserState = this.handleDeleteUserState.bind(this);

    this.handleDashboard = this.handleDashboard.bind(this);
    this.handleFoldDashboard = this.handleFoldDashboard.bind(this);
  }

  // 엔터키 입력
  handlePasswordChange( event ){
    if( event.which === 13 || event.keyCode === 13){
      this.handlePasswordCheck();
    }
  }

  // 비밀번호 확인
  handlePasswordCheck( event ){
    if( this.props.session.isLogined === false ) return false;
    if( this.props.session.user === 'UNKNOWN') return false;

    const password = document.querySelector('input.PasswordCheck[name=password]').value;
    if( typeof password === 'undefined' ) return false;

    this.props.passwordCheck( this.props.session.user.username, password);
  }

  // 회원정보 수정 이벤트
  handleUpdateUserState( event ){
    const displayName = document.querySelector('input.UserState[name=displayName]');
    // const password = document.querySelect('input.UserState[name=password]');
    
    if( this.props.session.isLogined === false ) return false;
    if( this.props.session.user === 'UNKNOWN') return false;
    if( typeof displayName === 'undefined' ) return false;
    if( displayName.value.length < 4) return false;
    
    const updateData = {
      username: this.props.session.user.username,
      displayName: displayName.value
    }
    this.props.updateUserState('default', updateData).then(()=>{
      const label = document.querySelector('input.UserState[name=displayName] + label');
      displayName.value = '';
      label.classList.remove('active');
      this.props.sessionCheck();
    });
  }

  // 회원탈퇴 이벤트
  handleDeleteUserState( event ){
    if( this.props.session.isLogined === false ) return false;
    if( this.props.session.user === 'UNKNOWN') return false;

    // TODO: action
  }
  
  sortToggle(prevSort, isPagingMode){
    if( isPagingMode === true ){
      return prevSort;
    } else {
      return (prevSort === 'ASC' ? 'DESC' : 'ASC' );
    }
  }

  // 대쉬보드 페이지 전환 && 대쉬보드 클릭 이벤트
  handleDashboard( _dashboard, _page ){
    console.log( _dashboard, _page);
    console.log( this.state.question.no, this.props.question.no);
    if( typeof _dashboard === 'undefined' ) return false;
    if( typeof _page === 'undefined' ) return false;
    
    const isPagingMode = ( _dashboard === 'page-mode' ? true : false );
    const isSameMode = this.state.dashboard.mode === _dashboard;
    const isSameQuestion = this.state.question.no === this.props.question.no;
    
    const dashboard = ( isPagingMode ? this.state.dashboard.mode : _dashboard );
    const questionNo = this.props.question.no;
    const count = this.state.dashboard.count;

    let sort = '';
    if( isSameQuestion && isSameMode ){
      sort = this.sortToggle(this.state.dashboard.sort, isPagingMode);
    } else {
      sort = this.default.sort;
    }

    this.props.getDashboardState( questionNo, dashboard, _page, count, sort ).then(()=>{
      this.setState(
        update( this.state, 
          { 
            question:{
              no: { $set: questionNo }
            },
            dashboard: 
            {
              mode: { $set: dashboard },
              visible: { $set: true },
              sort : { $set: sort },
            }
          }
        )
      );
    });
  }
  // 대쉬보드 접기 이벤트
  handleFoldDashboard( event ){
    if( this.state.dashboard.visible === true ){
      this.setState( update( this.state, { dashboard: {visible: { $set: false } }} ));
    }
  }


  componentWillMount(){
    console.log('[right-will-mount]');
  }
  componentDidMount(){
    console.log('[right-did-mount]');
  }
  
  componentWillReceiveProps(nextProps){
    const menu = nextProps.menu.toLowerCase();
    console.log('[right-receive]', menu, nextProps.algorithmNo, nextProps.question.status);
    console.log('[right-receive]', nextProps.session.status);
    console.log('[right-receive]', nextProps.dashboard);

    switch( menu ){
      case 'detail':
        if( nextProps.algorithmNo !== this.props.algorithmNo ){
          this.props.getAlgorithmData( nextProps.algorithmNo ).then(()=>{
            this.setState( update( this.state, { dashboard: {visible: { $set: false } }} ));
          });
        }
        break;
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log( "[업데이트?-right-container]",
            nextProps.session.status, 
            nextProps.question.status, 
            nextProps.dashboard.status,
            );
    if( nextProps.session.status === 'WAITING' ) return false;
    if( nextProps.question.status === 'WAITING' ) return false;
    if( nextProps.dashboard.status === 'WAITING' ) return false;

    return true;
  }

  componentWillUpdate(){
    console.log('[업데이트-right-container]')
  }

  render(){
    return (
      <section className="right-tab">
        <TabMenuWrapper
          titles={ this.props.titles }

          onMenuClick={ this.props.onMenuClick }
          />
        <ContentsWrapper
          // question-title
          menu={ this.props.menu }
          onAlgorithmSolve={ this.props.onAlgorithmSolve }
          content={ this.props.question.detail }

          // dashboard-page-changer
          dashboardVisible={ this.state.dashboard.visible }
          onChangeDashboard={ this.handleDashboard }
          onFoldDashboard={ this.handleFoldDashboard }
          dashboard={ this.props.dashboard }

          // question-title-report
          onShowPopUP={ this.props.onShowPopUp }

          // myPage-password-check
          onPasswordChange={ this.handlePasswordChange }
          onPasswordCheck={ this.handlePasswordCheck }
          passwordChecked={ this.props.pwdCheck.checked }

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
    question:{
      status: state.RightContentControll.question.status,
      no: state.RightContentControll.question.content.no,
      detail: state.RightContentControll.question.content
    },
    pwdCheck:{
      status: state.Authorization.status,
      checked: state.Authorization.pwdChecked,
    },
    update:{
      status: state.UserState.status,
    },
    dashboard:{
      status: state.RightContentControll.dashboard.status,
      table: {
        records: state.RightContentControll.dashboard.records,
        maxPage: state.RightContentControll.dashboard.maxPage
      },
      stats:{
        challenger: state.RightContentControll.question.content.challenger_count,
        perfect: state.RightContentControll.question.content.perfect_count,
        current: state.RightContentControll.question.content.current_persent,
        c: state.RightContentControll.question.content.lang_c_count,
        java: state.RightContentControll.question.content.lang_java_count,
        python: state.RightContentControll.question.content.lang_python_count,
      }
    }
  }
}
const mapDispatchToProps = ( dispatch )=>{
  return {
    // check user password
    passwordCheck: ( username, password )=>{
      return dispatch(authPasswordCheckRequest( username, password ));
    },
    // updated user editor setting
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    },
    // check user server connection
    sessionCheck: ()=>{
      return dispatch(authSessionRequest());
    },
    // get algorihtm detail data
    getAlgorithmData: ( algorithmNo ) =>{
      return dispatch( algorithmRequestData( algorithmNo ) );
    },
    getDashboardState: ( questionNo, dashboard, page, count, sort )=>{
      return dispatch(questionStateRequest(questionNo, dashboard, page, count, sort));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightContainer);