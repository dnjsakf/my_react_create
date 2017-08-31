import React, { Component } from 'react';
import { QuestionTitle, QuestionDetail } from '../QuestionDetail';
import { CodemirrorEditor } from '../TextEditor';
import style from './contentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('right-content-wrap', props);
  let content = '';
  const contentID = props.id;
  switch(contentID.toLowerCase()){
    case 'algorithm':
      if(Object.keys(props.data).length > 0){
        content = [
          (<QuestionTitle 
            key={ 1 }
            no={ props.data.no}
            subject={ props.data.subject }
            />),
          (<QuestionDetail 
            key={ 2 }
            data={ props.data }
            />)
        ];
      }
      break;
    case 'home':
      content = (<span>id "{contentID}" is no defined</span>);
      break;
    case 'editor':
      content = (<CodemirrorEditor/>);
      break;
    case 'mypage':
      content = (<span>id "{contentID}" is no defined</span>);
      break;
    default:
      content = (<span>id "{contentID}" is no defined</span>);
      break;
  }

  return(
    <section className='ContentsWrapper'>
      { content }
    </section>
  );
}

export default ContentsWrapper