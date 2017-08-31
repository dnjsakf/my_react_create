import React, { Component } from 'react';
import CodeMirror from 'react-codemirror';
import test from 'codemirror';

function handleKeyUp(changeText){
  console.log(CodeMirror);
  console.log(test);
}


const CodemirrorEditor = ( props )=>{
  const readOnly = false;
  const option = {
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    readOnly: readOnly,
  }
  const defaultSource = 'this is test code'

  return (
    <CodeMirror
      value={ defaultSource }
      options={ option }
      onChange={ handleKeyUp }/>
  );
}

export default CodemirrorEditor