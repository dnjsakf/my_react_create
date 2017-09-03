import React, { Component } from 'react';
import QuestionTitle from '../QuestionTitle/QuestionTitle';
import QuestionDetail from '../QuestionDetail/QuestionDetail';

const QuestionWrapper = ( props )=>{
  return (
    <section className='QuestionWrapper'>
      <QuestionTitle 
        no={ props.content.no}
        subject={ props.content.subject }
        onAlgorithmSolve={ props.onAlgorithmSolve }
      />
      <QuestionDetail
        content={ props.content }
      />
    </section>
  );
}

export default QuestionWrapper