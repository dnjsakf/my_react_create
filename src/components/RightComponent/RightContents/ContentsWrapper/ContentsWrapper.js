import React, { Component } from 'react';
// import { QuestionTitle, QuestionDetail } from '../QuestionDetail';
import { TextEditorWrapper } from '../TextEditor';
import { QuestionWrapper } from '../Question';
import { HomeWrapper } from '../Home';
import { MyPageWrapper } from '../MyPage';

import style from './ContentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('[right-content-wrap]', props);
  if( props.menu.toLowerCase() === 'detail' && props.content === "INIT" ) return null;

  let content = '';
  const menu = props.menu;
  switch(menu.toLowerCase()){
    case 'detail':
      if(Object.keys(props.content).length > 0){
        content = (
          <QuestionWrapper
            session={ props.session }

            isMyAlgo={ props.isMyAlgo }

            // 문제 타이틀
            content={ props.content }
            onAlgorithmSolve={ props.onAlgorithmSolve }

            // 대쉬보드
            dashboardVisible={ props.dashboardVisible }
            onChangeDashboard={ props.onChangeDashboard }
            onFoldDashboard={ props.onFoldDashboard }
            dashboard={ props.dashboard }
            
            // 신고팝업
            onShowPopUP={ props.onShowPopUP }
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
        <TextEditorWrapper />
      );
      break;
    case 'mypage':
      content = (
        <MyPageWrapper
          onPasswordChange={ props.onPasswordChange }
          onPasswordCheck={ props.onPasswordCheck }
          passwordChecked={ props.passwordChecked }

          onUpdateUserState={ props.onUpdateUserState }
          onDeleteUserState={ props.onDeleteUserState }

          user={ props.session.user }
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