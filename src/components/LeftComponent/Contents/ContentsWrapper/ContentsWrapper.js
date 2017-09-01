import React, { Component } from 'react';
import QuestionSubject from '../QuestionSubject/QuestionSubject';
import QuestionDetail from '../QuestionDetail/QuestionDetail';
import style from './ContentsWrapper.css';

const ContentsWrapper = ( props )=>{
  console.log('[left-content-wrap]', props.menu, props.content, typeof props.menu)
  let content = '';

  const menu = props.menu;
  switch(menu.toLowerCase()){
    case 'algorithm':
      content = (
        <QuestionSubject 
          subject={ props.content }
          onAlgorithmClick={ props.onAlgorithmClick }/>
      );
      break;
    case 'detail':
      content = (
        <QuestionDetail 
        content={ props.content }/>
      );
      break;
    // more add contents
    default:
      content = (<span>id "{props.menu}" is no defined</span>);
      break;
  } 
  
  return (
    <section className="left-contents">
      { content }
    </section>
  )
  
}
export default ContentsWrapper