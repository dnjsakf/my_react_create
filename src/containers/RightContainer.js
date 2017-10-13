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
  authSessionRequest, 
  authLogoutRequest
} from '../actions/Authorization';
// UserState
import { 
  userStateUpdateRequest, 
  userStateDeleteRequest
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

    const username = this.props.session.user.username;

    if( confirm("정말 탈퇴하시겠습니까?") ){
      console.log('[탈퇴]');
      this.props.logout( username ).then(
        ()=>{
          this.props.deleteUserState( username );
        }
      );
    }
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

    this.props.getDashboardState( this.props.isMyAlgo , questionNo, dashboard, _page, count, sort ).then(()=>{
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
    console.log('[오른쪽 프롭스 받음]', this.props, nextProps);
    const menu = nextProps.menu.toLowerCase();
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
    if( nextProps.status.session !== 'WAITING' ) return true;
    if( nextProps.status.question !== 'WAITING' ) return true;
    if( nextProps.status.dashboard !== 'WAITING' ) return true;
    if( nextProps.status.userstate !== 'WAITING' ) return true;

    const menuChanged = ( this.props.menu !== nextProps.menu );
    console.log('[오른쪽 메뉴 변경]', menuChanged, this.props.menu, nextProps.menu );
    if( menuChanged ) return true;

    const titlesChanged = ( this.props.titles !== nextProps.titles );
    console.log('[오른쪽 메뉴 추가]', titlesChanged, this.props.titles, nextProps.titles );
    if( titlesChanged ) return true;
    
    const sessionChanged = ( this.props.session !== nextProps.session );
    console.log('[오른쪽 세션 변경]', sessionChanged, this.props.session, nextProps.session );
    if( sessionChanged ) return true;

    const questionChanged = ( this.props.question !== nextProps.question );
    console.log('[오른쪽 문제 변경]', questionChanged, this.props.question, nextProps.question );
    if( questionChanged ) return true;

    const dashboardChanged = ( this.state.dashboard !== nextState.dashboard );
    console.log('[오른쪽 대쉬보드 변경]', dashboardChanged, this.state.dashboard, nextState.dashboard );
    if( dashboardChanged ) return true;
    
    const dashboardStatsChanged = ( this.props.dashboard.stats !== nextProps.dashboard.stats );
    console.log('[오른쪽 대쉬보드 통계 변경]', dashboardStatsChanged, this.props.dashboard.stats, nextProps.dashboard.stats );
    if( dashboardStatsChanged ) return true;

    const dashboardTableChanged = ( this.props.dashboard.table !== nextProps.dashboard.table );
    console.log('[오른쪽 대쉬보드 테이블 변경]', dashboardTableChanged, this.props.dashboard.table, nextProps.dashboard.table );
    if( dashboardTableChanged ) return true;

    const pwdCheckChanged = ( this.props.pwdCheck !== nextProps.pwdCheck );
    console.log('[오른쪽 mypage 변경]', pwdCheckChanged, this.props.pwdCheck, nextProps.pwdCheck );
    if( pwdCheckChanged ) return true;

    console.log('[오른쪽 업데이트 안함]');
    return false;
  }
  componentWillUpdate(){
    console.log('[오른쪽 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[오른쪽 업데이트 완료]');
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
          isMyAlgo={ this.props.isMyAlgo }

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
          session={ this.props.session }
          />
      </section>
    )
  }
}

const mapStateToProps = ( state )=>{
  return {
    status:{
      session: state.Authorization.status,
      question: state.RightContent.question.status,
      userstate: state.UserState.status,
      dashboard: state.RightContent.dashboard.status,
    },
    session:{
      isLogined: state.Authorization.isLogined,
      user: state.Authorization.user
    },
    question:{
      no: state.RightContent.question.content.no,
      detail: state.RightContent.question.content,
    },
    pwdCheck:{
      checked: state.Authorization.pwdChecked,
    },
    dashboard:{
      table: {
        records: state.RightContent.dashboard.records,
        maxPage: state.RightContent.dashboard.maxPage
      },
      stats: state.RightContent.question.stats
    }
  }
}
const mapDispatchToProps = ( dispatch )=>{
  return {
    // session logout for delete userstate
    logout: ( username )=>{
      return dispatch(authLogoutRequest(username));
    },
    // check user password
    passwordCheck: ( username, password )=>{
      return dispatch(authPasswordCheckRequest( username, password ));
    },
    // updated user editor setting
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    },
    // delete user state
    deleteUserState: ( deleteData )=>{
      return dispatch(userStateDeleteRequest( deleteData ));
    },
    // check user server connection
    sessionCheck: ()=>{
      return dispatch(authSessionRequest());
    },
    // get algorihtm detail data
    getAlgorithmData: ( algorithmNo ) =>{
      return dispatch( algorithmRequestData( algorithmNo ) );
    },
    getDashboardState: ( isMyAlgo, questionNo, dashboard, page, count, sort )=>{
      return dispatch(questionStateRequest(isMyAlgo, questionNo, dashboard, page, count, sort));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightContainer);