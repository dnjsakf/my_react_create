import React, { Component } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';
import axios from 'axios';

import { compileRequest } from './../../../../../actions/Compile';

import CodemirrorEditor from './../CodemirrorEditor/CodemirrorEditor';
import CompileResult from './../CompileResult/CompileResult';

import style from './TextEditorWrapper.css';
import { Input } from 'react-materialize';

class TextEditorWrapper extends Component{
  constructor(props){
    super(props);

    this.source = {
      'java':'public class MAIN\n'
            +'{\n'
            +'    public static void main(String[] args)\n'
            +'    {\n'
            +'      System.out.println("Hello, JAVA");\n'
            +'    }\n'    
            +'}\n',
      'python':'a, b = map( int, input().split() );\n'
              +'print( a + b )\n',
      'c':'#include<stdio.h>\n'
         +'\n'
         +'int main(void)\n'
         +'{\n'
         +'    int a, b;\n'
         +'    scanf("%d %d", &a, &b);\n'
         +'    printf("%d", a + b);\n'
         +'    return 0;\n'
         +'}\n'
    }

    this.state = {
      test: true,
      focus: false,
      compiling: false,
      saving: false,
      language: props.session.editor.editorLanguage,
      sourceCode: this.source[props.session.editor.editorLanguage]
      /* 언어별로 기본 소스코드를 가져와야되는데 어떻게 만들어줄까.. */
    }

    this.handleTyping = this.handleTyping.bind(this);

    this.handleSaveSource = this.handleSaveSource.bind(this);
    this.handleRunCompile = this.handleRunCompile.bind(this);

    this.handleLanguageSelect = this.handleLanguageSelect.bind(this);
  }
  componentDidMount(){
    this.setState( update(this.state, { test: {$set: false} }))
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
   * 중간중간 소스코드를 저장하기 위해.
   * 에디터에서 포커스를 잃으면 저장하도록 한다. -> 저장 버튼을 누르면 저장하도록 변경 (2017-09-28)
   */
  handleSaveSource( focus ){
    /* 컴파일 중에는 재 컴파일을 실행하지 못하도록 */
    if( typeof this.props.status.compile === 'WAITING' ) return false;
    if( typeof this.props.question.no === 'undefined' ) return false;
    if( this.state.sourceCode.length === 0 ) return false;

    console.log( this.state.language );
    console.log( this.props.question.no );
    console.log( this.state.sourceCode );
    console.log('[SAVE]',this.state.language, this.state.sourceCode.length );
    
    this.setState(
      update( this.state, 
        {
          saving: { $set: true }
        }
      )
    );

    const bodys = {
      questionNo: this.props.question.no,
      sourceCode: this.state.sourceCode
    };
    axios.post(`/api/compile/save/sourceCode/${this.state.language}`, bodys )
    .then((response)=>{
      this.setState(
        update( this.state, 
          {
            saving: { $set: false }
          }
        )
      );
      console.log('[SAVE COMPLITED]', response.data );
    })
    .catch((error)=>{
      this.setState(
        update( this.state, 
          {
            saving: { $set: false }
          }
        )
      );
      console.log('[SOURCE SAVE SOMETING BROKEN]', error );
    });
  }
  /**
   * 컴파일 
   */
  handleRunCompile( ){
    /* 컴파일 중에는 재 컴파일을 실행하지 못하도록 */
    if( typeof this.props.status.compile === 'WAITING' ) return false;
    if( typeof this.props.question.no === 'undefined' ) return false;
    if( this.state.sourceCode.length === 0 ) return false;

    console.log( this.state.language );
    console.log( this.props.question.no );
    console.log( this.state.sourceCode );
    
    this.setState(
      update( this.state, 
        {
          compiling: { $set: true }
        }
      )
    );
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
    if( nextProps.status.compile !== 'WAITING' ){
      this.setState(
        update( this.state, 
          {
            compiling: { $set: false }
          }
        )
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    /* 타이핑 중일 땐 업데이트 안함 */
    if( nextState.focus === true ) return false; 
    
    /* 컴파일이 끝나기 전에 다시 누르지 못하게 하기 */
    if( nextProps.status.compile !== 'WAITING' ) return true;
    if( nextProps.status.session === 'WAITING' ) return false;

    const languageChanged = ( this.state.language !== nextState.language );
    console.log('[에디터 언어 변경]', languageChanged, this.state.language, nextState.language);
    if( languageChanged ) return true;

    const resultChanged = ( this.props.compile !== nextProps.compile );
    console.log('[에디터 결과 변경]', resultChanged, this.props.compile, nextProps.compile);
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
    return (
      <section className='TextEditorWrapper'>
        {/*  select 필요하구나.. */}
        <div className="language-selector">
          <Input
            s={6}
            type='select' 
            defaultValue={ this.state.language }
            onChange={ this.handleLanguageSelect }>

            <option value='c'>c</option>
            <option value='java'>java</option>
            <option value='python'>python</option>
          </Input>
        </div>
        <div className="text-editor">
          <CodemirrorEditor
            handleTyping={ this.handleTyping }

            default={{
              language: this.state.language,
              theme: this.props.session.editor.editorTheme,
              source: this.source[this.state.language]
            }}
            />
        </div>
        <div className="compile-result">
          <CompileResult
            handleRunCompile={ this.handleRunCompile } 
            handleSaveSource={ this.handleSaveSource }

            saving={ this.state.svaing }
            compiling={ this.state.compiling }

            result={ this.props.compile }
            />
        </div>
      </section>
    );
  }
}
const mapStateToProps = (state)=>{
  console.log('[RECEIVE REDUCER]', state.Compile);
  
  return {
    status:{
      session: state.Authorization.status,
      compile: state.Compile.status
    },
    session:{
      isLogined: state.Authorization.isLogined,
      editor: state.Authorization.user.editor
    },
    question:{
      no: state.RightContent.question.content.no
    },
    compile:{
      success: state.Compile.success,
      result: state.Compile.result
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