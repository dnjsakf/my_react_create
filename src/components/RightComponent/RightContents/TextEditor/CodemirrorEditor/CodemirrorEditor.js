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
    <div>
      <div className="language-selector">
        <Input
          s={6}
          type='select' 
          defaultValue={ props.default.language }
          onChange={ props.handleSelect }>
          <option value='c'>c</option>
          <option value='java'>java</option>
          <option value='python'>python</option>
        </Input>
      </div>
      <div className="text-editor">
        <CodeMirror
          autoFocus={ true }
          onFocusChange={ props.handleFocus }
          value={ props.default.source }
          options={ option }
          onChange={ props.handleTyping }
          />
      </div>
    </div>
  );
}

export default CodemirrorEditor