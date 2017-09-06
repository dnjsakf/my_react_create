import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { 
  authLogoutRequest, 
  authSessionRequest 
} from '../actions/Authorization'; 

import Header from './HeaderContainer';
import Section from './SectionContainer';
import { PopUpWrapper } from '../components/PopUpComponent';

import { userStateUpdateRequest } from '../actions/UserState';
import { insertUserReportRequest } from '../actions/UserReport';
import { getNoticeRequest } from '../actions/Notice';

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
        visible: false,
      }
    }
    this.popupModes = ['notice', 'setting', 'report'];
    
    this.handleLogout = this.handleLogout.bind(this);
    this.handleSession = this.handleSession.bind(this);

    this.handleShowPopUp = this.handleShowPopUp.bind(this);
    this.handleClosePopUp = this.handleClosePopUp.bind(this);
    this.handleSaveReport = this.handleSaveReport.bind(this);
    this.handleSaveSetting = this.handleSaveSetting.bind(this);
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

  handleShowPopUp( mode ){
    if( this.popupModes.indexOf(mode) === -1 ) return false;

    if( mode === 'notice' ){
      this.props.getNoticeList(1, 10);
    }

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
    if( this.state.popup.visible === false ) return false;

    const editorTheme = document.querySelector('#editor-theme');
    const editorLanguage = document.querySelector('#editor-language');
    const editorFont = document.querySelector('#editor-font');
    const editorFontSize = document.querySelector('#editor-fontSize');
 
    const updateData = {
      username: this.props.session.user.username,
      theme: editorTheme.value,
      language: editorLanguage.value,
      font: editorFont.value,
      fontSize: editorFontSize.value
    }

    this.props.updateUserState('setting', updateData).then(()=>{
      this.props.sessionCheck();
    });
  }

  /**   
   *    
   *   report_description = {
          1 : "오타가 있어요"
          2 : "문제가 잘못되었어요"
          3 : "테스트 케이스가 이상해요"
          4 : "기타" 
   *  }
   */
  handleSaveReport( event ){
    if(this.state.popup.visible === false) return false;

    const reportType = document.querySelector('#user-report-type');
    const reportDetail = document.querySelector('#user-report-detail');

    if(typeof reportType === 'undefined') return false;
    if(typeof reportDetail === 'undefined') return false;
    
    const report = {
      questionNo: this.props.question.no,
      userNo: this.props.session.user.no,
      reportType: reportType.value,
      reportDetail: reportDetail.value,
    }

    this.props.insertUserReport( report );
  }

  componentDidMount(){
    this.props.sessionCheck();
  }

  componentWillReceiveProps(nextProps){

  }
  
  render(){
    let popup = '';
    if( this.state.popup.visible === true ){
      popup = (
        <PopUpWrapper
          popup={ this.state.popup }
        
          isLogined={ this.props.isLogined }
          user={ this.props.session.user }  // default = editor
          defaultReport={ this.props.question }
          defaultNotice={ this.props.notice.list }

          onSaveSetting={ this.handleSaveSetting }
          onSaveReport={ this.handleSaveReport }
          onClosePopUp={ this.handleClosePopUp }
        />
      );
    }
    
    return (
      <section>
        { this.state.popup.visible === true && popup }
        <Header
          isLogined={ this.props.isLogined }
          user={ this.props.session.user }

          onShowPopUp={ this.handleShowPopUp }
          onLogout={ this.handleLogout }
          onSession={ this.handleSession }
        />
        <Section
          isLogined={ this.props.isLogined }
          user={ this.props.session.user }

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
    mode: state.Authorization.mode,
    isLogined: state.Authorization.isLogined,
    status: state.Authorization.status,
    session:{
      status: state.Authorization.status,
      user: state.Authorization.user
    },
    question: {
      no: state.RightContentControll.content.no,
      subject: state.RightContentControll.content.subject
    },
    notice: {
      list: state.AdminNotice.notice.list
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
    },
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    },
    insertUserReport: ( report )=>{
      return dispatch(insertUserReportRequest( report ));
    },
    getNoticeList: ( page, count )=>{
      return dispatch(getNoticeRequest( page, count));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainApp)