import React, { Component } from 'react';
import { QuestionTitle, QuestionDetail } from '../QuestionDetail';
import { TextEditorWrapper } from '../TextEditor';
import style from './ContentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('right-content-wrap', props);
  let content = '';
  const menu = props.menu;
  switch(menu.toLowerCase()){
    case 'detail':
      if(Object.keys(props.content).length > 0){
        content = [
          (<QuestionTitle 
            key={ 1 }
            no={ props.content.no}
            subject={ props.content.subject }
            onAlgorithmSolve={ props.onAlgorithmSolve }
            />),
          (<QuestionDetail 
            key={ 2 }
            content={ props.content }
            />)
        ];
      }
      break;
    case 'home':
      content = (<span>id "{menu}" is no defined</span>);
      break;
    case 'editor':
      content = (<TextEditorWrapper
                  content={{
                    inputcase: props.content.input,
                    outputcase: props.content.output
                  }}
                  />);
      break;
    case 'mypage':
      content = (<span>id "{menu}" is no defined</span>);
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