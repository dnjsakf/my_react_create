import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';
import cmStyle from 'codemirror/lib/codemirror.css';

import cmModePython from 'codemirror/mode/python/python';
import cmModeClike from 'codemirror/mode/clike/clike';       // c && java

import cmThemeDracula from 'codemirror/theme/dracula.css';
import cmThemeMidnight from 'codemirror/theme/Midnight.css';

import style from './CodemirrorEditor.css';

const CodemirrorEditor = ( props )=>{
  let editorMode = 'clike';
  if( props.default.editorLanguage === 'python' ){
    editorMode = 'python';
  }

  const readOnly = false;
  const option = {
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    readOnly: readOnly,
    theme: props.default.editorTheme,
    mode: editorMode
  }

  return (
    <CodeMirror
      autoFocus={ true }
      onFocusChange={ props.handleFocus }
      defaultValue={ props.defaultSource }
      options={ option }
      onChange={ props.handleTyping }
      />
  );
}

export default CodemirrorEditor