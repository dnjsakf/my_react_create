// import React, { Component } from 'react';
// import update from 'react-addons-update';

// class AuthLogin extends Component{
//   constructor(props){
//     super(props);

//     this.state = {
//       mode: 'login',
//       login: {
//         username: '',
//         password: '',
//       },
//       register: {
//         username: '',
//         displayName: '',
//         password: '',
//         passwordCheck: ''
//       }
//     }

//     this.defaultMode = ['lgoin', 'register'];

//     this.handleAuthLogin = this.handleAuthLogin.bind(this);
//     this.handleAuthRegister = this.handleAuthRegister.bind(this);
//   }
//   handleModeChange( event ){
//     const mode = event.target.value;
//     // undefined는 어디서 온녀석일까
//     if( typeof mode !== 'undefined' ) return false;
//     // 선택한 모드가 login, register가 아니라면 변경할 필요가 없음.
//     if( this.defaultMode.indexOf(mode) === -1) return false;
//     // 선택한 모드가 현재 모드랑 같으면 VIEW를 변경할 필요가 없음.
//     if( this.state.mode === mode ) return false;

//     //이제야 비로소 변경할 수 있겠군
//     this.setState(
//       update( this.state,
//         {
//           mode: { $set: mode }
//         }
//       )
//     )
//   }

//   handleChange( event ){
//     const mode = this.state.mode;
//     const value = event.target.value;   // input에서 입력한 글자들이 저장됨.
//     const tiemr = undefined;

//     if( timer !== undefined )

//     tiemr =  
//   }

//   handleAuthLogin( event ){

//   }

//   handleAuthRegister( event ){

//   }
// }


// import { authLoginRequest } from '../../actions/Auth';
