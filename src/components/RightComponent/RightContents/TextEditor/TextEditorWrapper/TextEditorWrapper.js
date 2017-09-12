import React, { Component } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';
import axios from 'axios';

import { compileRequest } from './../../../../../actions/Compile';

import CodemirrorEditor from './../CodemirrorEditor/CodemirrorEditor';
import CompileResult from './../CompileResult/CompileResult';

import style from './TextEditorWrapper.css';

class TextEditorWrapper extends Component{
  constructor(props){
    super(props);

    this.state = {
      focus: false,
      language: props.session.editor.editorLanguage,
      sourceCode: ''
    }

    this.handleSaveFile = this.handleSaveFile.bind(this);
    this.handleTyping = this.handleTyping.bind(this);
    this.handleRunCompile = this.handleRunCompile.bind(this);

    this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
  }
  componentDidMount(){
    
  }
  /**
   * 중간중간 소스코드를 저장하기 위해.
   * 에디터에서 포커스를 잃으면 저장하도록 한다.
   */
  handleSaveFile( focus ){
    this.setState(
      update( this.state, 
        {
          focus: {$set: focus }
        }
      )
    )
    // 컴파일 세이브
    if( !focus ){
      console.log('[SAVE]',this.state.language, this.state.sourceCode.length );
      /* 한번도 타이핑 안했으면 저장도 안함 */
      // if( this.state.sourceCode.length === 0) return false

      const url = `/api/compile/save/sourceCode/${this.state.language}`;
      const bodys = {
        questionNo: this.props.question.no,
        sourceCode: this.state.sourceCode
      };
      const saved = axios.post(url, bodys );
      saved.then((response)=>{
        console.log('[SAVE COMPLITED]', response.data );
      });
    }
  }
  /**
   * 타이핑 할 때 마다 state를 업데이트 하자.
   */
  handleTyping( typing ){
    this.setState( 
      update(this.state, 
        {
          sourceCode: { $set: typing }
        }
      )
    );
  }
  /**
   * 컴파일 
   */
  handleRunCompile( ){
    /* 컴파일 중에는 재 컴파일을 실행하지 못하도록 */
    if( typeof this.props.status.compile === 'WAITING' ) return false;
    if( typeof this.props.question.no === 'undefined' ) return false;

    console.log( this.state.language );
    console.log( this.props.question.no );
    console.log( this.state.sourceCode );

    this.props.compileRun( this.state.language, this.props.question.no, this.state.sourceCode );
  }
  /**
   * Select에서 언어를 선택하면 state.language를 업데이트.
   */
  handleLanguageSelect( event ){
    console.log( this.state.language, event.target.value );
    /** 언어가 같으면 업데이트 안해도됨 */
    if( this.state.language === event.target.value ) return false;
    this.setState(
      update( this.state, 
        {
          language: { $set: event.target.value   }
        }
      )
    )
  }

  /**
   * 옵션에서 언어 변경하면 state.language를 업데이트.
   */
  componentWillReceiveProps(nextProps){
    console.log('[에디터 프롭스 받음]', nextProps);
    if( this.props.session.editor.editorLanguage !== nextProps.session.editor.editorLanguage){
      this.setState(
        update( this.state, 
          {
            language: { $set: nextProps.session.editor.editorLanguage }
          }
        )
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    /* 타이핑 중일 땐 업데이트 안함 */
    if( nextState.focus === true ) return false;
    
    if( nextProps.status.session === 'WAITING' ) return false;
    if( nextProps.status.compile === 'WAITING' ) return false;

    const languageChanged = ( this.state.language !== nextState.language );
    console.log('[에디터 언어 변경]', languageChanged, this.state.language, nextState.language);
    if( languageChanged ) return true;

    const resultChanged = ( this.props.result !== nextProps.result );
    console.log('[에디터 결과 변경]', resultChanged, this.props.result, nextProps.result);
    if( resultChanged ) return true;
    
    const editorChanged = ( this.props.session.editor !== nextProps.session.editor );
    console.log('[에디터 변경]', editorChanged, this.props.session.editor, nextProps.session.editor);
    if( editorChanged ) return true;

    console.log('[에디터 업데이트 안함]');
    return false;
  }

  componentWillUpdate(){
    console.log('[에디터 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[에디터 업데이트 완료]');
  }

  render(){
    const values = {
      language: this.state.language,
      theme: this.props.session.editor.editorTheme,
      source: 'class INIT_JAVA{\n'
        +'  public static void main(String[] args){\n'
        +'    System.out.println("Hello, JAVA");\n'
        +'  }\n'    
        +'}'
    }
    return (
      <section className='TextEditorWrapper'>
        {/*  select 필요하구나.. */}
        <CodemirrorEditor
          handleFocus={ this.handleSaveFile }
          handleTyping={ this.handleTyping }

          default={ values }

          handleSelect={ this.handleLanguageSelect }
          />
        <CompileResult
          handleRunCompile={ this.handleRunCompile } 

          inputcase={ this.props.content.inputcase }
          outputcase={ this.props.content.outputcase }
          />
      </section>
    );
  }
}
const mapStateToProps = (state)=>{
  return {
    status:{
      session: state.Authorization.status,
      compile: state.Compile.python.status
    },
    session:{
      isLogined: state.Authorization.isLogined,
      editor: state.Authorization.user.editor
    },
    question:{
      no: state.RightContentControll.question.content.no
    },
    result:{
      python: state.Compile.python.result
    }
  };
};
const mapDispatchToProps = (dispatch)=>{
  return {
    compileRun: ( language, questionNo, sourceCode )=>{
      return dispatch( compileRequest( language, questionNo, sourceCode ) );
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextEditorWrapper);