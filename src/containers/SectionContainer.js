import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';

import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

class SectionContainer extends Component{
  constructor(props){
    super(props);

    console.log( '[섹션 프롭스]' ,props )

    this.default={
      title: {
        visitor: {
          left: ['Algorithm'],
          right: ['Home']
        },
        member: {
          left: ['Algorithm', 'MyAlgorithm'],
          right: ['Home', 'MyPage']
        }
      }
    }
    this.state ={
      titleUpdated: false,
      left:{
        menu: this.default.title.visitor.left[0],
        title: this.default.title.visitor.left,
      },
      right:{
        algorithmNo: undefined, 
        menu: this.default.title.visitor.right[0],
        title: this.default.title.visitor.right,
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
              title: { $push: ( existMenuRight === -1 ? [setRightMenu]  : [] ) }
            }
          }
        )
      )
    }
  }

  componentDidMount(){
    console.log('[섹션 마운트]', this.props);
  }

  // 근데 여기서 이거 만들면
  // Props를 받을때마다 탐색해야되서
  // 비용이 좀 들꺼같은데..
  componentWillReceiveProps(nextProps){
    console.log('[섹션 프롭스 받음]', this.props, nextProps);
    // 기본 메뉴 세팅
    if( this.state.titleUpdated === false ){
      if( nextProps.session.isLogined === true ){
        this.setState(
          update( this.state,  
            {
              titleUpdated: { $set: true },
              left:{
                title: { $set: this.default.title.member.left }
              },
              right:{
                title: { $set: this.default.title.member.right }
              }
            }
          )
        );
      }
    } else {
      if( nextProps.session.isLogined === false){
        this.setState(
          update( this.state,  
            {
              titleUpdated: { $set: false },
              left:{
                menu: { $set: this.default.title.visitor.left[0] },
                title: { $set: this.default.title.visitor.left }
              },
              right:{
                menu: { $set: this.default.title.visitor.right[0] },
                title: { $set: this.default.title.visitor.right }
              }
            }
          )
        );
      }
    }
  }

  // 왼쪽이나 오른쪽 메뉴 state가 변경되면 업데이트해라.
  shouldComponentUpdate(nextProps, nextState){
    const leftTitleInserted = ( this.state.left.title !== nextState.left.title );
    console.log('[섹션-왼쪽 메뉴 추가]', leftTitleInserted, this.state.left.title, nextState.left.title)
    if( leftTitleInserted ) return true;
    
    const rightTitleInserted = ( this.state.right.title !== nextState.right.title );
    console.log('[섹션-오른쪽 메뉴 추가]', rightTitleInserted, this.state.right.title, nextState.right.title)
    if( rightTitleInserted ) return true;
    
    console.log('[섹션 status]', nextProps.status);
    if( nextProps.status.session !== 'WAITING ') return true;
    if( nextProps.status.userState !== 'WAITING' ) return true;
    if( nextProps.status.dashboard !== 'WAITING' ) return true;
    if( nextProps.status.leftContent !== 'WAITING' ) return true;
    if( nextProps.status.rightContent !== 'WAITING' ) return true;
    
    const sessionChanged = ( this.props.session !== nextProps.session );
    console.log('[섹션 세션 변경]', sessionChanged, this.props.session, nextProps.session );
    if( sessionChanged ) return true;

    const algorithmChanged = ( this.state.right.algorithmNo !== nextState.right.algorithmNo );
    console.log('[섹션 문제 변경]', algorithmChanged, this.state.right.algorithmNo, nextState.right.algorithmNo );
    if( algorithmChanged ) return true;

    const leftMenuChanged = ( this.state.left.menu !== nextState.left.menu );
    console.log('[섹션-왼쪽 메뉴 변경]', leftMenuChanged, this.state.left.menu, nextState.left.menu)
    if( leftMenuChanged ) return true;
    
    const rightMenuChanged = ( this.state.right.menu !== nextState.right.menu );
    console.log('[섹션-오른쪽 메뉴 변경]', rightMenuChanged, this.state.right.menu, nextState.right.menu)
    if( rightMenuChanged ) return true;
    
    console.log('[섹션 업데이트 안함]');
    return false;
  }
  componentWillUpdate(){
    console.log('[섹션 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[섹션 업데이트 완료]');
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
          isMyAlgo={ this.state.left.menu.toLowerCase() === 'myalgorithm' }

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
      dashboard: state.RightContent.dashboard.status,
      leftContent: state.LeftContent.status,
      rightContent: state.RightContent.question.status
    },
    session:{
      isLogined: state.Authorization.isLogined,
    }
  };
}
export default connect(
  mapStateToProps,
)(SectionContainer);