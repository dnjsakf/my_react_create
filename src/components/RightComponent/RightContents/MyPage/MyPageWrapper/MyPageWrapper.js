import PasswordCheck from '../PasswordCheck/PasswordCheck';
import UserHistory from '../UserHistory/UserHistory';
import UserState from '../UserState/UserState';

import style from './MyPageWrapper.css';

import React, { Component } from 'react';

const MyPageWrapper = ( props )=>{
  let content = '';
  
  if( props.passwordChecked === true ){
    content = (
      <UserState 
        onUpdateUserState={ props.onUpdateUserState }

        user={ props.user }
      />
    )
  } else {
    content = (
      <PasswordCheck 
        onPasswordChange={ props.onPasswordChange }
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