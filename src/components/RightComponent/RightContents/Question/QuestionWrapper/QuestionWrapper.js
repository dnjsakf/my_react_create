import React, { Component } from 'react';
import QuestionTitle from '../QuestionTitle/QuestionTitle';
import QuestionDetail from '../QuestionDetail/QuestionDetail';

import { Dashboard } from '../QuestionDashboard';

const QuestionWrapper = ( props )=>{

  const dashboard = {
    challenger: props.content.challenger_count,
    prefect: props.content.perfect_count,
    current: props.content.current_persent,
    C: props.content.lang_c_count,
    java: props.content.lang_java_count,
    python: props.content.lang_python_count,
  }

  return (
    <section className='QuestionWrapper'>
      <QuestionTitle 
        no={ props.content.no}
        subject={ props.content.subject }
        onAlgorithmSolve={ props.onAlgorithmSolve }
    
        // 신고팝업
        onShowPopUP={ props.onShowPopUP }
      />
      <QuestionDetail
        isDashClicked={ props.isDashClicked }
        questionState={ props.questionState }
        onDashboard={ props.onDashboard }
        content={ props.content }>
        <Dashboard
          onDashboard={ props.onDashboard }
          dashboard={ dashboard }/>
      </QuestionDetail>
    </section>
  );
}

export default QuestionWrapper