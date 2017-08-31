import React, { Component } from 'react';
import QuestionSubject from '../QuestionSubject/QuestionSubject';
import QuestionDetail from '../QuestionDetail/QuestionDetail';
import style from './ContentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('[left-content-wrap]',props, typeof props.id)
  const contentID = props.id;
  let content = '';
  switch(contentID.toLowerCase()){
    case 'algorithm':
      content = (
        <QuestionSubject 
          subject={ props.content }
          getAlgorithmDetail={ props.getAlgorithmDetail }/>
      );
      break;
    case 'detail':
      content = (
        <QuestionDetail detail={ props.content }/>
      );
      break;
    // more add contents
    default:
      content = (<span>id "{contentID}" is no defined</span>);
      break;
  } 
  
  return (
    <section className="left-contents">
      { content }
    </section>
  )
  
}
export default ContentsWrapper