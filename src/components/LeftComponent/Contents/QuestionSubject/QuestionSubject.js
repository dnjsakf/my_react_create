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
        className="animated fadeInDown"
        key={ index }
        href="#"
        onClick={ ()=>{ props.onAlgorithmClick( item.no )} }>
        <div className="list-number">{ index+1 }</div>
        <div className="list-subject">{ item.subject }</div>
      </CollectionItem>
    );
  });

  return (
    <section className="QuestionSubject">
      <Collection>
        { list }
      </Collection>
    </section>
  );
}

export default QuestionSubject