import React, { Component } from 'react';

/*    props = {
        onClick,
        isLogined
      }
 */
const Auth = (props)=>(
  <div>
    <button 
      onClick={props.handleAuth}>
      { props.isLogined ? 'Logout' : 'Login'}
    </button>
  </div>
)

export default Auth;