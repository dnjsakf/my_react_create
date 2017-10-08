
import React, { Component } from 'react';
import update from 'react-addons-update';

import { connect } from 'react-redux';

import axios from 'axios';

/* 액션 */
/* Created compareRun */

/* 컴포넌트 */
import { CodemirrorEditor } from './../../RightComponent/RightContents/TextEditor';
import { DashboardTable } from './../../DashboardComponent';
import CompareState from './../CompareState/CompareState';

/* 스타일 */
import style from './CompareWrapper.css';
import { Button, Icon } from 'react-materialize';

/* 유틸 */
import { analysis } from './../../../utility/analysis.js';

class CompareWrapper extends Component{
  constructor(props){
    super(props);

    console.log( '[Compare Wrapper Variable]\n',props );
    this.state={
      my:{
        no: props.dashboard.myRecords[props.option.language][0].no,
        name: props.dashboard.myRecords[props.option.language][0].name,
        language: props.option.language,
        sourceCode: props.dashboard.myRecords[props.option.language][0].sourceCode,
        result: props.dashboard.myRecords[props.option.language][0].result,
        date: props.dashboard.myRecords[props.option.language][0].date,
      },
      /* get ajax */
      other:{
        no: props.dashboard.records[props.option.row].no,
        name: props.dashboard.records[props.option.row].name,
        language: props.dashboard.records[props.option.row].language,
        sourceCode: props.dashboard.records[props.option.row].sourceCode,
        result: props.dashboard.records[props.option.row].result,
        date: props.dashboard.records[props.option.row].date
      },
      analysis:{
        my: {},
        other: {}
      }
    }

    this.handleFindSource = this.handleFindSource.bind(this);
    this.handleRunCompare = this.handleRunCompare.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentWillMount(){
    /** 내 데이터만 가져오기 */
    // const questionNo = this.props.question.no;
    // const language = this.state.other.language;
    // const url = `/api/data/compare/my/next/${questionNo}/${language}/true`;
    // axios.get(url)
    // .then((response)=>{

    // })
    // .catch((error)=>{
      
    // })
  }

  // Get prev && next source-code
  handleFindSource( mode, target ){
    const questionNo = this.props.question.no;
    const language = this.state[target].language;
    const no = this.state[target].no;
    
    const url = `/api/data/compare/${target}/${mode}/${questionNo}/${language}/${no}`;
    axios.get(url)
      .then((response)=>{
        console.log('[COMPARE PREV SUCCESS]', response);
        if( target === 'my'){
          this.setState(
            update( this.state,
              { 
                my: { $set: response.data.data },
                analysis: { 
                  my: {$set : {}},
                  other: {$set : {}},
                }
              }
            )
          )
        } else {
          this.setState(
            update( this.state,
              {
                other: { $set: response.data.data },
                analysis: { 
                  my: {$set : {}},
                  other: {$set : {}},
                }
              }
            )
          )
        }
      })
      .catch((error)=>{
        console.error('[COMPARE PREV FAILURE]', error);
      });
  }

  handleRunCompare(){
    this.setState(
      update( this.state,
      {
        analysis:{
          my: {$set: analysis( this.state.my.language, this.state.my.sourceCode )},
          other: {$set: analysis( this.state.other.language, this.state.other.sourceCode )},
        }
      }
    ));
  }

  shouldComponentUpdate(nextProps, nextState){
    const otherSourceChanged = ( this.state.other !== nextState.other );
    console.log('[비교하기 상대 소스 변경]', otherSourceChanged, this.state.other, nextState.other );
    if( otherSourceChanged ) return true;

    const mySourceChanged = ( this.state.my !== nextState.my );
    console.log('[비교하기 내 소스 변경]', mySourceChanged, this.state.my, nextState.my );
    if( mySourceChanged ) return true;
    
    const mySourceAnalysis = ( this.state.analysis.my !== nextState.analysis.my );
    console.log('[비교하기 내 소스 분석]', mySourceAnalysis, this.state.analysis.my, nextState.analysis.my );
    if( mySourceAnalysis ) return true;

    const otherSourceAnalysis = ( this.state.analysis.other !== nextState.analysis.other );
    console.log('[비교하기 상대 소스 분석]', otherSourceAnalysis, this.state.analysis.other, nextState.analysis.other );
    if( otherSourceAnalysis ) return true;

    return false;
  }

  componentWillUpdate(){
    console.log('[비교하기 업데이트 진행]');
  }

  componentDidUpdate(){
    console.log('[비교하기 업데이트 완료]', this.state);
    this.handleOnScroll();
  }

  handleOnScroll( ){
    const scroller = document.querySelectorAll('div.compare-state');
    const simple = document.querySelectorAll('.simple.card');
    for(let i=0; i<scroller.length; i++){
      this.scrollDown( scroller[i], simple[i].scrollHeight, 20, 10 );
    }
  }

  scrollDown( element, end, speed, duration ){
    if( element.scrollTop+speed >= end ) return false
    const animation = setInterval(()=>{
      if( element.scrollTop >= end ){
        element.scrollTop = end;
        return clearInterval(animation);
      } else {
        element.scrollTop += ( speed + element.scrollTop * 0.1 );
      }
    }, duration);
    // 강제종료
    setTimeout(()=>{ return clearInterval(animation); }, 1000);
  }

  render(){
    return (
      <section className="CompareWrapper">
        <header className="compare-title">
          <a>비교하기</a>
        </header>
        <section className="compare-content">
          {/* 이걸 component로 빼도 될듯 */}
          <div className="my-sourcecode"> 
            <div className="content-title">
              <ul className="pagination">
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('prev', 'my') } }>
                  <a href="#"><Icon value="my">chevron_left</Icon></a>
                </li>
                <li className="active"><a>내 소스코드</a></li>
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('next', 'my') } }>
                  <a href="#"><Icon value="my">chevron_right</Icon></a>
                </li>
              </ul>
            </div>
            <div className="text-editor">
              <CodemirrorEditor className="CodemirrorEditor"
                                default={{
                                  theme: this.props.user.editor.editorTheme,
                                  language: this.state.my.language,
                                  source: this.state.my.sourceCode
                                }}/>
            </div>
            <div className="compare-state">
              <CompareState className="CompareState"
                            state={ this.state.my }
                            analysis={ this.state.analysis.my } />
            </div>
          </div>

          {/* 이걸 component로 빼도 될듯 */}
          <div className="other-sourcecode">
            <div className="content-title">
              <ul className="pagination">
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('prev', 'other') } }>
                  <a href="#"><Icon>chevron_left</Icon></a>
                </li>
                <li className="active"><a>{this.state.other.no} {this.state.other.name }</a></li>
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('next', 'other') } }>
                  <a href="#"><Icon>chevron_right</Icon></a>
                </li>
              </ul>
            </div>
            <div className="text-editor">
              <CodemirrorEditor className="CodemirrorEditor"
                                default={{
                                  theme: this.props.user.editor.editorTheme,
                                  language: this.state.other.language,
                                  source: this.state.other.sourceCode
                                }}/>
            </div>
            <div className="compare-state">
              <CompareState className="CompareState"
                            state={ this.state.other }
                            analysis={ this.state.analysis.other } />
            </div>
          </div>
        </section>
        <nav className="compare-controller">
          <Button onClick={ this.props.onClose }>
            Cancle
          </Button>
        </nav>
        <div id="btn-compare">
          <a alt="비교하기" href="#" onClick={this.handleRunCompare}><Icon className="medium">compare_arrows</Icon></a>
        </div>
      </section>
    );
  }
}


const mapStateToProps = (state)=>{
  return {
    status:{
      question: state.RightContent.question.status,
      session: state.Authorization.status,
      dashboard: state.RightContent.dashboard.status
    },
    user:{
      editor: state.Authorization.user.editor
    },
    question:{
      no: state.RightContent.question.content.no
    },
    dashboard:{
      myRecords: state.RightContent.dashboard.myRecords,
      records: state.RightContent.dashboard.records,
      maxPage: state.RightContent.dashboard.maxPage
    }
  }
} 
const mapDispatchToProps = (dispatch)=>{
  return {
    /* compareRun */
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareWrapper);
