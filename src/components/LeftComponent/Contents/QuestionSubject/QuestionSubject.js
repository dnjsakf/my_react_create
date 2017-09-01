import React, { Component } from 'react';
import { Collection, CollectionItem } from 'react-materialize';
import style from './QuestionSubject.css';

const QuestionSubject = ( props )=>{
  console.log('[알고리즘 리스트 생성]', props );
  if( typeof props.subject === 'undefined' ){
    return (<span>NOT FOUND LIST DATA</span>);
  }

  const list = [];
  const subject = props.subject;
  Array.from(subject).map((item, index)=>{
    list.push(
      <CollectionItem
        key={ index }
        href={"#"}
        onClick={ ()=>{ props.onAlgorithmClick( item.no )} }> 
        { item.subject }
      </CollectionItem>
    );
  });

  return (
    <Collection>
      { list }
    </Collection>
  );
}

export default QuestionSubject