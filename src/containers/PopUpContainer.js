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

    this.state = {
      notice: {
        toggle: true,
        record: 0
      }
    }

    this.default = {
      page: 1,
      count: 10
    }

    // 신고하기
    this.handleSaveReport = this.handleSaveReport.bind(this);
    
    // 환경설정
    this.handleSaveSetting = this.handleSaveSetting.bind(this);
    
    // 공지사핟
    this.handleNoticeBack = this.handleNoticeBack.bind(this);
    this.handleNoticeSelect = this.handleNoticeSelect.bind(this);
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

  // 공지사항 뒤로가기
  handleNoticeBack( ){
    if( this.state.notice.toggle === false ){
      this.setState(
        update( this.state, 
          {
            notice: {
              toggle: { $set: true }
            }
          }
        )
      )
    }
  }

  // 공지사항 선택
  handleNoticeSelect( record ){
    if( typeof record === 'undefined' ) return false;

    this.setState(
      update( this.state, 
        {
          notice: {
            toggle: { $set: false },
            record: { $set: record }
          }
        }
      )
    )
  }

  // 공지사항 페이지 변경
  handleNoticePage( page ){
    if( typeof page === 'undefined' ) return false;

    this.props.getNoticeList( page, this.default.count );
  }

  componentDidMount(){
    if( this.props.popup.mode === 'notice' ){
      const page = this.default.page;
      const count = this.default.count;
      this.props.getNoticeList( page, count );
    }
  }
  
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.status.session !== 'waiting' ||
        nextprops.status.question !== 'waiting' ||
        nextProps.status.notice !== 'wiating'){
          return true;
        }

    const sessionChange = (this.props.session !== nextProps.session );
    if( sessionChange ) return true;
    
    const questionChange = ( this.props.question !== nextProps.question );
    if( questionChange ) return true;

    const noticePropsChange = ( this.props.notice !== nextProps.notice );
    if( noticePropsChange ) return true;

    const noticeStateChange = ( this.state.notice !== nextState.notice );
    if( noticeStateChange ) return true;

    return false;
  }

  render(){
    return (
      <PopUpWrapper
        popup={ this.props.popup }
      
        isLogined={ this.props.session.isLogined }
        user={ this.props.session.user }  // default = editor

        defaultReport={ this.props.question } // selected-question
        defaultNotice={ this.props.notice }   // list-data

        noticeInfo={ this.state.notice }

        onClosePopUp={ this.props.onClosePopUp }

        // 환경섲렁        
        onSaveSetting={ this.handleSaveSetting }
        
        // 신고하기
        onSaveReport={ this.handleSaveReport }
        
        // 공지사항
        onPageNotice={ this.handleNoticePage }
        onSelectNotice={ this.handleNoticeSelect }
        onBackNotice={ this.handleNoticeBack }
        />
    )
  }
}
const mapStateToProps = (state)=>{
  return {
    status:{
      session: state.Authorization.status,
      notice: state.AdminNotice.notice.status,
      qusetion: state.RightContent.question.status
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
      no: state.RightContent.question.content.no,
      subject: state.RightContent.question.content.subject
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