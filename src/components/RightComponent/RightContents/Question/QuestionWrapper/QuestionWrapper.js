import React, { Component } from 'react';
import QuestionTitle from '../QuestionTitle/QuestionTitle';
import QuestionDetail from '../QuestionDetail/QuestionDetail';

import style from './QuestionWrapper.css'

import { 
  DashboardWrapper,
  DashboardTable
} from './../../../../DashboardComponent';

function test( event ){
  console.log( event.target.value );
}

const QuestionWrapper = ( props )=>{
  const dashboardTable = (
    <DashboardTable
      isMyAlgo={ props.isMyAlgo }

      onChangeDashboard={ props.onChangeDashboard }
      onFoldDashboard={ props.onFoldDashboard }
      table={ props.dashboard.table }
      onShowPopUP={ props.onShowPopUP }
      isLogined={ props.session.isLogined }
      />
  )

  return (
    <section className='QuestionWrapper'>
      <QuestionTitle 
        no={ props.content.no}
        subject={ props.content.subject }
        onAlgorithmSolve={ props.onAlgorithmSolve }

        isLogined={ props.session.isLogined }
    
        // 신고팝업
        onShowPopUP={ props.onShowPopUP }
      />
      <section className="detail-scroll">
        <DashboardWrapper 
          onChangeDashboard={ props.onChangeDashboard }
          stats={ props.dashboard.stats }>
          { props.dashboardVisible === true && dashboardTable }
        </DashboardWrapper>
        <QuestionDetail content={ props.content } />
      </section>
    </section>
  );
}

export default QuestionWrapper