import React, { Component } from 'react';
import style from './CodemirrorEditor.css';

import CodeMirror from 'react-codemirror';
import cmStyle from 'codemirror/lib/codemirror.css';
import cmModePython from 'codemirror/mode/python/python.js';
import cmModeJavascript from 'codemirror/mode/javascript/javascript.js';
import cmThemeDracula from 'codemirror/theme/dracula.css';

function handleOnChange(changeText){

}

const CodemirrorEditor = ( props )=>{
  const readOnly = false;
  const option = {
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    readOnly: readOnly,
    theme: 'dracula',
    mode: 'python'
  }
  const defaultSource = 'this is test code'

  return (
    <CodeMirror
      value={ defaultSource }
      options={ option }
      onChange={ handleOnChange }
      />
  );
}

export default CodemirrorEditor