import PasswordCheck from '../PasswordCheck/PasswordCheck';
import UserHistory from '../UserHistory/UserHistory';
import UserState from '../UserState/UserState';

import style from './MyPageWrapper.css';

import React, { Component } from 'react';

const MyPageWrapper = ( props )=>{
  let content = '';

  console.log( '[]asdfasdㅁㄴㅇ리;ㅁ너ㅏㅇㄻ닝런이;', props.passwordChecked)
  
  if( props.passwordChecked === true ){
    content = (
      <UserState />
    )
  } else {
    content = (
      <PasswordCheck 
        onPasswordCheck={ props.onPasswordCheck }
      />
    )
  }
  return (
    <section className='MyPageWrapper'>
      { content }
    </section>
  );
}

export default MyPageWrapper