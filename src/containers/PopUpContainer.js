import React, { Component } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';

import { PopUpWrapper } from '../components/PopUpComponent';

import { authSessionRequest } from '../actions/Authorization';
import { insertUserReportRequest } from '../actions/UserReport';
import { getNoticeRequest } from '../actions/Notice';
import { userStateUpdateRequest } from '../actions/UserState';

class PopUpContainer extends Component{
  constructor(props){
    super(props);

    this.default = {
      page: 1,
      count: 10
    }

    this.handleSaveReport = this.handleSaveReport.bind(this);
    this.handleSaveSetting = this.handleSaveSetting.bind(this);
    this.handleNoticePage = this.handleNoticePage.bind(this);
  }

  // 환경설정 저장
  handleSaveSetting( event ){
    if( this.props.popup.visible === false ) return false;

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

  // 신고하기 저장(제출); 
  handleSaveReport( event ){
    if(this.props.popup.visible === false) return false;

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

  // 공지사항 페이지 변경
  handleNoticePage( page ){
    if( typeof page === 'undefined' ) return false;

    const count = this.default.count;
    this.props.getNoticeList( page, count );
  }

  componentDidMount(){
    if( this.props.popup.mode === 'notice' ){
      const page = this.default.page;
      const count = this.default.count;
      this.props.getNoticeList( page, count );
    }
  }

  render(){
    return (
      <PopUpWrapper
        popup={ this.props.popup }
      
        isLogined={ this.props.session.isLogined }
        user={ this.props.session.user }  // default = editor

        defaultReport={ this.props.question }
        defaultNotice={ this.props.notice }

        onClosePopUp={ this.props.onClosePopUp }
        onPageNotice={ this.handleNoticePage }
        onSaveSetting={ this.handleSaveSetting }
        onSaveReport={ this.handleSaveReport }
        />
    )
  }
}
const mapStateToProps = (state)=>{
  return {
    status:{
      session: state.Authorization.status,
      notice: state.AdminNotice.notice.status,
      qusetion: state.RightContentControll.question.status
    },
    session:{
      isLogined: state.Authorization.isLgoined,
      user: state.Authorization.user,
    },
    notice: {
      records: state.AdminNotice.notice.records,
      maxPage: state.AdminNotice.notice.maxPage,
    },
    question: {
      no: state.RightContentControll.question.content.no,
      subject: state.RightContentControll.question.content.subject
    }
  }
}
const mapDispatchToProps = (dispatch)=>{
  return {
    insertUserReport: ( report )=>{
      return dispatch(insertUserReportRequest( report ));
    },
    getNoticeList: ( page, count )=>{
      return dispatch(getNoticeRequest( page, count));
    },
    updateUserState: ( mode, updateData )=>{
      return dispatch(userStateUpdateRequest( mode, updateData ));
    },
    sessionCheck: ()=>{
      return dispatch(authSessionRequest());
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpContainer)