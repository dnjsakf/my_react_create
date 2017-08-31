import React, { Component } from 'react';
import { Collection, CollectionItem } from 'react-materialize';
import style from './QuestionSubject.css';

const QuestionSubject = ( props )=>{
  const list = [];
  const subject = props.subject;

  console.log('[왜 여기가 도냐]', props)
  Array.from(subject).map((item, index)=>{
    list.push(
      <CollectionItem
        key={ index }
        href={"#"}
        onClick={ ()=>{props.getAlgorithmDetail( item.no )} }> 
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