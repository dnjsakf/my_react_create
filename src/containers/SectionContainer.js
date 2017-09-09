import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';

import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

class SectionContainer extends Component{
  constructor(props){
    super(props);

    this.default={
      title: {
        left: ['Algorithm'],
        right: ['Home']
      }
    }

    this.state ={
      left:{
        menu: this.default.title.left[0],
        title: this.default.title.left,
        // temp:{
        //   visitor: ['Algorithm'],
        //   member: ['Algorithm', 'MyAlgorithm'],
        //   disable: ['Detail']
        // }
      },
      right:{
        algorithmNo: undefined, 
        menu: this.default.title.right[0],
        title: this.default.title.right,
        // temp:{
        //   visitor: ['Home'],
        //   member: ['Home', 'MyPage'],
        //   disable: ['Detail', 'Editor']
        // }
      }
    }
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleAlgorithmSelect = this.handleAlgorithmSelect.bind(this);
    this.handleAlgorithmSolve = this.handleAlgorithmSolve.bind(this);
  }
  // 탭 메뉴를 클릭하면,
  // 현재 선택된 메뉴가 어디인지 저장한다.
  handleMenuClick( location, _menu ){
    console.log('\n[Tab-Menu-Click]', location, _menu);
    if(location === 'left'){
      // LEFT MENU
      this.setState(
        update( this.state,
          {
            left:{
              menu: { $set: _menu }
            }
          }
        )
      );
    } else {
       // RIGHT MENU
      this.setState(
        update( this.state,
          {
            right:{
              menu: { $set: _menu }
            }
          }
        )
      );
    }
  }

  // algorithm 선택 이벤트
  handleAlgorithmSelect( algorithmNo ){
    console.log('[Algorihtm-select ]', algorithmNo, this.state.right.title );

    const setLeftMenu = 'Detail';
    const existMenu = this.state.right.title.indexOf(setLeftMenu);

    this.setState(
      update( this.state,
        {
          right:{
            algorithmNo: { $set: algorithmNo }, 
            menu: { $set: setLeftMenu },
            title: { $push: ( existMenu === -1 ? [setLeftMenu]  : [] ) }
          }
        }
      )
    );
  }

  // algorithm solve 이벤트
  handleAlgorithmSolve(){
    console.log('[Algorihtm-Sovle-Click]', this.state);
    const setLeftMenu = this.state.right.menu;
    const setRightMenu = 'Editor';
    
    if(this.state.right.menu.toLowerCase() === 'detail'){
      const existMenuLeft = this.state.left.title.indexOf(setLeftMenu);
      const existMenuRight = this.state.right.title.indexOf(setRightMenu);

      this.setState(
        update( this.state,
          {
            left: {
              menu: { $set: setLeftMenu },
              title: { $push: ( existMenuLeft === -1 ? [setLeftMenu]  : [] ) }
            },
            right: {
              menu: { $set: setRightMenu },
              title: { $push: ( existMenuRight === -1 ? [setLeftMenu]  : [] ) }
            }
          }
        )
      )
    }
  }

  // 두개의 Action이 동시에 발생할 일이 없으니까,
  // 여기서 setState를 각각의 상태에 맞게 요청하면 되지 않을까?
  // 여기는 첫로드에 실행은 안되고,
  // 액션 발생 후 Props가 넘어오면 발생함.
  componentWillReceiveProps(nextProps){
    console.log('[메인 세션 컴포넌트 프롭스 받음]', nextProps, this.state);
    if( nextProps.session.isLogined === true ){
      const setLeftMenu = 'MyAlgorithm';
      const setRightMenu = 'MyPage';
      const existMenuLeft = this.state.left.title.indexOf(setLeftMenu);
      const existMenuRight = this.state.right.title.indexOf(setRightMenu);
      if( existMenuLeft === -1 && existMenuRight === -1){
        this.setState(
          update(this.state,  
            {
              left:{
                title: { $push: [setLeftMenu] }
              },
              right:{
                title: { $push: [setRightMenu] }
              }
            }
          )
        )
      }
    }
  }

  // 왼쪽이나 오른쪽 메뉴 state가 변경되면 업데이트해라.
  shouldComponentUpdate(nextProps, nextState){
    console.log( '[메인 세션 변경할꺼?]', nextProps, nextState);
    console.log( '[메인 세션 변경할꺼?]', nextProps, nextState);
    console.log( '[메인 세션 변경할꺼?]', nextProps, nextState);

    const algorithmNoChanged = ( this.state.right.algorithmNo !== nextState.right.algorithmNo );
    console.log('[문제 변경]', algorithmNoChanged, this.state.right.algorithmNo, nextState.right.algorithmNo );
    if( algorithmNoChanged ) return true

    const leftTitleChanged = ( this.state.left.title !== nextState.left.title );
    const rightTitleChanged = ( this.state.right.title !== nextState.right.title );
    console.log('[왼쪽 메뉴 추가]', leftTitleChanged, this.state.left.title, nextState.left.title)
    console.log('[오른쪽 메뉴 추가]', rightTitleChanged, this.state.right.title, nextState.right.title)
    if( leftTitleChanged || rightTitleChanged ) return true

    const leftMenuChanged = ( this.state.left.menu !== nextState.left.menu );
    const rightMenuChanged = ( this.state.right.menu !== nextState.right.menu );
    console.log('[왼쪽 메뉴 변경]', leftMenuChanged, this.state.left.menu, nextState.left.menu)
    console.log('[오른쪽 메뉴 변경]', rightMenuChanged, this.state.right.menu, nextState.right.menu)
    if( leftMenuChanged || rightMenuChanged ) return true;
    
    if( nextProps.status.session === 'WAITING ') return false;
    if( nextProps.status.userState === 'WAITING' ) return false;
    if( nextProps.status.dashboard === 'WAITING' ) return false;
    if( nextProps.status.leftContent === 'WAITING' ) return false;
    if( nextProps.status.rightContent === 'WAITING' ) return false;
    console.log('[FINISH STATUS WAITING]');
    
    console.log('[여기까지 왔으면 업데이트 안해도됨]');
    return false;
  }
  componentWillUpdate(){
    console.log('[메인 세션 컴포넌트 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[메인 세션 컴포넌트 업데이트 완료]');
  }

  render(){
    return (
      <section className="main-section">
        <LeftContainer 
          menu={ this.state.left.menu }
          
          titles={ this.state.left.title }

          onMenuClick={ this.handleMenuClick }
          onAlgorithmClick={ this.handleAlgorithmSelect }
          />
        <RightContainer 
          menu={ this.state.right.menu }

          titles={ this.state.right.title }
          
          algorithmNo={ this.state.right.algorithmNo }
          
          onShowPopUp={ this.props.onShowPopUp }
          onMenuClick={ this.handleMenuClick }
          onAlgorithmSolve={ this.handleAlgorithmSolve }
        />
      </section>
    )
  }
}


import {
  algorithmRequestList,
  algorithmRequestData
} from '../actions/Algorithm';

// store에 저장된 데이터를 여기에 불러올꺼야
const mapStateToProps = (state)=>{
  return {
    status:{
      session: state.Authorization.status,
      userState: state.UserState.status,
      dashboard: state.RightContentControll.dashboard.status,
      leftContent: state.LeftContentControll.status,
      rightContent: state.RightContentControll.question.status
    },
    session:{
      isLogined: state.Authorization.isLogined,
    }
  };
}
export default connect(
  mapStateToProps,
)(SectionContainer);