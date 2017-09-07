import React, { Component } from 'react';
import QuestionTitle from '../QuestionTitle/QuestionTitle';
import QuestionDetail from '../QuestionDetail/QuestionDetail';

import { 
  DashboardWrapper, 
  DashboardTable 
} from './../../../../DashboardComponent';

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
        content={ props.content }>

        { /* 여기에 Dashboard가 추가 될거임, Detail과 토글로 변경될 수 있도록 */ }
        <DashboardWrapper />

      </QuestionDetail>

    </section>
  );
}

export default QuestionWrapper