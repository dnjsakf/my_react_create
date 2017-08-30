import React, { Component } from 'react';
import { Collection, CollectionItem } from 'react-materialize';

const QuestionSubject = ( props )=>{
  const list = [
      (
        <CollectionItem
          key= {1}
          href="#" 
          onClick={props.onClick}>
          a
        </CollectionItem>
      ),
      (
        <CollectionItem 
          key= {2}
          href="#" 
          onClick={props.onClick}>
          b
        </CollectionItem>
      ),
      (
        <CollectionItem 
          key= {3}
          href="#" 
          onClick={props.onClick}>
          c
        </CollectionItem>
      )
    ];

  return (
    <Collection>
      { list }
    </Collection>
  );
}

export default QuestionSubject