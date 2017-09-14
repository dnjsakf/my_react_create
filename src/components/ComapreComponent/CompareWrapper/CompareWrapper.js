
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

class CompareWrapper extends Component{
  constructor(props){
    super(props);

    this.state={
      my:{
        no: props.dashboard.myRecords['python'][0].no,
        name: props.dashboard.myRecords['python'][0].name,
        language: props.user.editor.editorLanguage,
        sourceCode: props.dashboard.myRecords['python'][0].sourceCode,
        result: props.dashboard.myRecords['python'][0].result,
        date: props.dashboard.myRecords['python'][0].date,
      },
      /* get ajax */
      other:{
        no: props.dashboard.records[props.value].no,
        name: props.dashboard.records[props.value].name,
        language: props.dashboard.records[props.value].language,
        sourceCode: props.dashboard.records[props.value].sourceCode,
        result: props.dashboard.records[props.value].result,
        date: props.dashboard.records[props.value].datae
      }
    }

    this.handleFindSource = this.handleFindSource.bind(this);
  }
  
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
              { my: { $set: response.data.data } }
            )
          )
        } else {
          this.setState(
            update( this.state,
              { other: { $set: response.data.data } }
            )
          )
        }
      })
      .catch((error)=>{
        console.error('[COMPARE PREV FAILURE]', error);
      });
  }


  shouldComponentUpdate(nextProps, nextState){
    const otherSourceChanged = ( this.state.other !== nextState.other );
    console.log('[비교하기 상대 소스 변경]', otherSourceChanged, this.state.other, nextState.other );
    if( otherSourceChanged ) return true;

    const mySourceChanged = ( this.state.my !== nextState.my );
    console.log('[비교하기 내 소스 변경]', mySourceChanged, this.state.my, nextState.my );
    if( mySourceChanged ) return true;

    return false;
  }
  componentWillUpdate(){
    console.log('[비교하기 업데이트 진행]');
  }
  componentWillUpdate(){
    console.log('[비교하기 업데이트 완료]', this.state);
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
                  <a><Icon value="my">chevron_left</Icon></a>
                </li>
                <li className="active"><a>내 소스코드</a></li>
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('next', 'my') } }>
                  <a><Icon value="my">chevron_right</Icon></a>
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
                            state={ this.state.my } />
            </div>
          </div>

          {/* 이걸 component로 빼도 될듯 */}
          <div className="other-sourcecode">
            <div className="content-title">
              <ul className="pagination">
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('prev', 'other') } }>
                  <a><Icon>chevron_left</Icon></a>
                </li>
                <li className="active"><a>{this.state.other.no} {this.state.other.name }</a></li>
                <li className="waves-effect"
                    onClick={ ()=>{ this.handleFindSource('next', 'other') } }>
                  <a><Icon>chevron_right</Icon></a>
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
                            state={ this.state.other } />
            </div>
          </div>
        </section>
        <nav className="compare-controller">
          <Button onClick={ this.props.onClose }>
            Cancle
          </Button>
        </nav>
        <div id="btn-compare">
          <a alt="비교하기"><Icon className="medium">compare_arrows</Icon></a>
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
