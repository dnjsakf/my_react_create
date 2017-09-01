import React, { Component } from 'react';
import CodemirrorEditor from '../CodemirrorEditor/CodemirrorEditor';
import CompileResult from '../CompileResult/CompileResult';
import style from './TextEditorWrapper.css';

const TextEditorWrapper = ( props )=>{
  return (
    <section className='TextEditorWrapper'>
      <CodemirrorEditor/>
      <CompileResult
        inputcase={ props.content.inputcase }
        outputcase={ props.content.outputcase }
      />
    </section>
  );
}

export default TextEditorWrapper