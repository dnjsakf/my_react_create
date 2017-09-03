import React, { Component } from 'react';
// import { QuestionTitle, QuestionDetail } from '../QuestionDetail';
import { TextEditorWrapper } from '../TextEditor';
import { QuestionWrapper } from '../Question';
import { HomeWrapper } from '../Home';
import { MyPageWrapper } from '../MyPage';

import style from './ContentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('right-content-wrap', props);
  let content = '';
  const menu = props.menu;
  switch(menu.toLowerCase()){
    case 'detail':
      if(Object.keys(props.content).length > 0){
        content = (
          <QuestionWrapper
            content={ props.content }
            onAlgorithmSolve={ props.onAlgorithmSolve }
          />
        );
      }
      break;
    case 'home':
      content = (
        <HomeWrapper/>
      );
      break;
    case 'editor':
      content = (
        <TextEditorWrapper
          content={{
            inputcase: props.content.input,
            outputcase: props.content.output
          }}
        />
      );
      break;
    case 'mypage':
      content = (
        <MyPageWrapper
          onPasswordCheck={ props.onPasswordCheck }
          passwordChecked={ props.passwordChecked }
        />
      );
      break;
    default:
      content = (<span>id "{menu}" is no defined</span>);
      break;
  }

  return(
    <section className='ContentsWrapper'>
      { content }
    </section>
  );
}

export default ContentsWrapper