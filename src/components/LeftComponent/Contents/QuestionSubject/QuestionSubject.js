import React, { Component } from 'react';
import { Collection, CollectionItem } from 'react-materialize';
import style from './QuestionSubject.css';

const QuestionSubject = ( props )=>{
  const list = [];
  const subject = props.subject;
  console.log(typeof props.subject, props.subject)
  Array.from(subject).map((item, index)=>{
    list.push(
      <CollectionItem
        key= { index }
        href= "#"                 // Material option 
        onClick={ props.onClick }> 
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