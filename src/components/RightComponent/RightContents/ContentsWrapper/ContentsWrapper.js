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

            isDashClicked={ props.isDashClicked }
            questinoState={ props.questinoState }
            onDashboard={ props.onDashboard }
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
          onPasswordChange={ props.onPasswordChange }
          onPasswordCheck={ props.onPasswordCheck }
          passwordChecked={ props.passwordChecked }

          onUpdateUserState={ props.onUpdateUserState }

          user={ props.user }
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