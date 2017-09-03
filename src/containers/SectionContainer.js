import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import update from 'react-addons-update';

import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';

class SectionContainer extends Component{
  constructor(props){
    super(props);

    this.state ={
      left:{
        status: 'INIT',
        isSolving: false,
        menuTitles: ['Algorithm', 'MyAlgorithm', 'Detail'],
        disableTitles: ['Detail'],
        menu:'Algorithm',
        content:[],
      },
      right:{
        status: 'INIT',
        isSolving: false,
        menuTitles: ['Home', 'MyPage', 'Detail', 'Editor'],
        disableTitles: ['Detail', 'Editor'],
        menu: 'Home',
        content: [],
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

      // 추가 기능 구현 필요
      let check = true;
      if(this.state.left.isSolving && _menu.toLowerCase() !== 'detail'){
        if(!confirm('그만하시겠습니까?')){
          return false;
        }
      }

      switch(_menu.toLowerCase()){
        case 'algorithm':
          this.props.getAlgorithmList().then(()=>{
            if( this.props.left.status === 'SUCCESS' ){
              this.setState(
                update( this.state,
                  {
                    left:{
                      isSolving: { $set: false },
                      status: { $set: this.props.left.status },
                      menu: { $set: _menu },
                      content: { $set: this.props.left.content }
                    }
                  }
                )
              );
            }
          });
        case 'detail':
          this.setState(
            update( this.state,
              {
                left:{
                  menu: { $set: _menu }
                }
              }
            )
          );
          break;
        case 'myalgorithm':
          this.setState(
            update( this.state,
              {
                isSolving: { $set: false },
                left:{
                  menu: { $set: _menu }
                }
              }
            )
          );
          break;
        default:
          return false;
      }
    } else {
      // RIGHT MENU

      // 추가 기능 구현 필요
      let check = true;
      if(this.state.right.isSolving && _menu.toLowerCase() !== 'editor'){
        if(!confirm('그만하시겠습니까?')){
          return false;
        }
      }
      switch(_menu){
        default:
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
  }

  // algorithm 선택 이벤트
  handleAlgorithmSelect( algorithmNo ){
    console.log('[Algorihtm-select ]', algorithmNo );
    this.props.getAlgorithmData( algorithmNo ).then(()=>{
      if(this.props.right.status === 'SUCCESS'){
        const showLeftMenu = 'Detail';
        const del = this.state.right.disableTitles.indexOf(showLeftMenu);
        const delCount = del === -1 ? 0 : 1;
        this.setState(
          update( this.state,
            {
              right:{
                status: { $set: this.props.right.status },
                menu: { $set: showLeftMenu },
                disableTitles: { $splice: [[del, delCount]]},
                content: { $set: this.props.right.content }
              }
            }
          )
        );
      }
    });
  }

  // algorithm solve 이벤트
  handleAlgorithmSolve(){
    console.log('[Algorihtm-Sovle-Click]', this.state);
    const getRightMenu = this.state.right.menu;
    const setRightMenu = 'Editor';
    
    if(this.state.right.menu.toLowerCase() === 'detail'){
      const delLeft = this.state.left.disableTitles.indexOf(getRightMenu);
      const delRight = this.state.right.disableTitles.indexOf(setRightMenu);
      const delLeftCount = delLeft === -1 ? 0 : 1;
      const delRightCount = delRight === -1 ? 0 : 1;
      this.setState(
        update( this.state,
          {
            left: {
              isSolving: { $set: true },
              menu: { $set: getRightMenu },
              disableTitles: { $splice: [[delLeft, delLeftCount]]},
              content: { $set: this.state.right.content }
            },
            right: {
              isSolving: { $set: true },
              menu: { $set: setRightMenu },
              disableTitles: { $splice: [[delRight, delRightCount]]},
            }
          }
        )
      )
    }
  }


  // 처음 들어왔을 때 알고리즘 목록을 먼저 보여줄 것인가?
  componentDidMount(){
    const leftMenu = this.state.left.menu;
    const leftStatus = this.state.left.status;
    if( this.state.left.status === 'INIT' && leftMenu.toLowerCase() === 'algorithm'){
      this.props.getAlgorithmList().then(()=>{
        this.setState(
          update( this.state,
            {
              left: {
                status: { $set: this.props.left.status },
                menu: { $set: leftMenu },
                content: { $set: this.props.left.content }
              }
            }
          )
        )
      });
    }
  }

  // 두개의 Action이 동시에 발생할 일이 없으니까,
  // 여기서 setState를 각각의 상태에 맞게 요청하면 되지 않을까?
  // 여기는 첫로드에 실행은 안되고,
  // 액션 발생 후 Props가 넘어오면 발생함.
  componentWillReceiveProps(nextProps){
    console.log('[메인 세션 컴포넌트 프롭스 받음]', nextProps, this.state);
  }
  componentWillUpdate(){
    console.log('[메인 세션 컴포넌트 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[메인 세션 컴포넌트 업데이트 완료]');
  }

  // 왼쪽이나 오른쪽 메뉴 state가 변경되면 업데이트해라.
  shouldComponentUpdate(nextProps, nextState){
    console.log('[왼쪽 메뉴 변경]',this.state.left.menu, nextState.left.menu)
    console.log('[오른쪽 메뉴 변경]',this.state.right.menu, nextState.right.menu)
    const update = JSON.stringify(nextState) !== JSON.stringify(this.state);
    console.log('[업데이트 해야됨?]', update);
    return update;
  }

  render(){
    return (
      <section className="main-section">
        <LeftContainer 
          disableTitles={ this.state.left.disableTitles }
          menuTitles={ this.state.left.menuTitles }
          menu={ this.state.left.menu }
          content={ this.state.left.content }

          onMenuClick={ this.handleMenuClick }
          onAlgorithmClick={ this.handleAlgorithmSelect }
          />
        <RightContainer 
          disableTitles={ this.state.right.disableTitles }
          menuTitles={ this.state.right.menuTitles }
          menu={ this.state.right.menu }
          content={ this.state.right.content }
          
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
    left:{
      status: state.LeftContentControll.status,
      content: state.LeftContentControll.content, 
    },
    right:{
      status: state.RightContentControll.status,
      content: state.RightContentControll.content, 
    }
  };
}
// store에 저장된 리듀서를 여기에 불러올꺼야 :: 액션 -> 리듀서 -> 
const mapDispatchToProps = (dispatch)=>{
  return {
    // 알고리즘 리스트 가져올 액션
    getAlgorithmList: ()=>{ 
      return dispatch( algorithmRequestList() ); 
    },
    // 알고리즘 상세정보를 가져올 액션
    getAlgorithmData: ( algorithmNo ) =>{
      return dispatch( algorithmRequestData( algorithmNo ) );
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionContainer);