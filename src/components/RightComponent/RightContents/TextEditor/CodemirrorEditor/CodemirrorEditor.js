import React, { Component } from 'react';

import CodeMirror from 'react-codemirror';

import cmJavascript from 'codemirror/lib/codemirror.js';
import cmStyle from 'codemirror/lib/codemirror.css';

import cmModePython from 'codemirror/mode/python/python';
import cmModeClike from 'codemirror/mode/clike/clike';       // c && java

import cmThemeDracula from 'codemirror/theme/dracula.css';
import cmThemeMidnight from 'codemirror/theme/Midnight.css';

import style from './CodemirrorEditor.css';
import { Input } from 'react-materialize';

const CodemirrorEditor = ( props )=>{
  let editorMode = 'clike';
  if( props.default.language === 'python' ){
    editorMode = 'python';
  }

  const readOnly = false;
  const option = {
    value:  props.default.source,
    lineNumbers: true,
    lineWrapping: true,
    matchBrackets: true,
    readOnly: readOnly,
    theme: props.default.theme,
    mode: editorMode
  }
  // 컴파일 옵션 확인
  // console.log('[CODEMIRROR OPTIONS]\n', option);

  return (
    <div className="CodemirrorEditor">
      <CodeMirror
        onFocusChange={ props.handleFocus }
        defaultValue={ props.default.source }
        options={ option }
        onChange={ props.handleTyping }/>
    </div>
  );
}

export default CodemirrorEditor