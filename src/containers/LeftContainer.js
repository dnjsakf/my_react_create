import React, { Component } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';

import { 
  TabMenuWrapper,
  ContentsWrapper
 } from '../components/LeftComponent';

class LeftContainer extends Component{
  constructor(props){
    super(props);
  }

  componentWillMount(){
    if( this.props.status.content === 'INIT' ){
      if( this.props.menu.toLowerCase() === 'algorithm'){
        console.log('[left-will-mount]', this.props.status.content);
        this.props.getAlgorithmList('list'); 
      }
    }
  }
  componentDidMount(){
    console.log('[left-did-mount]');
  }

  componentWillReceiveProps(nextProps){
    console.log('[왼쪽 프롭스 받음]', this.props, nextProps);
    const nextMenu = nextProps.menu.toLowerCase();
    const prevMenu = this.props.menu.toLowerCase();

    if( nextMenu !== prevMenu ){
      switch( nextMenu ){
        case 'algorithm':
          console.log('[ALGORITHM]')
          this.props.getAlgorithmList('list');
          break;
        case 'myalgorithm':
          console.log('[MY-ALGORITHM]')
          this.props.getAlgorithmList('myalgo');
          break;
        default:
          return false;
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.status.session === 'WAITING' ) return false;
    if( nextProps.status.content === 'WAITING' ) return false;

    const menuChanged = ( this.props.menu !== nextProps.menu );
    console.log('[왼쪽 메뉴 변경]', menuChanged, this.props.menu, nextProps.menu );
    if( menuChanged ) return true;

    const sessionChanged = ( this.props.session !== nextProps.session );
    console.log("[왼쪽 세션 변경]", sessionChanged, this.props.session, nextProps.session );
    if( sessionChanged ) return true;

    const tabTitleChanged = ( this.props.titles !== nextProps.titles );
    console.log("[왼쪽 메뉴 변경]", tabTitleChanged, this.props.titles, nextProps.titles );
    if( tabTitleChanged ) return true;

    const algorithmListChanged = ( this.props.content.list !== nextProps.content.list );
    console.log("[왼쪽 리스트 변경]", algorithmListChanged, this.props.content.list, nextProps.content.list );
    if( algorithmListChanged ) return true;

    const algorithmDetailChanged = ( this.props.content.detail !== nextProps.content.detail );
    console.log("[왼쪽 문제 변경]", algorithmDetailChanged, this.props.content.detail, nextProps.content.detail );
    if( algorithmDetailChanged ) return true;

    console.log('[왼쪽 업데이트 안함]');
    return false;
  }
  componentWillUpdate(){
    console.log('[왼쪽 업데이트 진행]');
  }
  componentDidUpdate(){
    console.log('[왼쪽 업데이트 완료]');
  }

  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          titles={ this.props.titles }

          onMenuClick={ this.props.onMenuClick }
        />
        <ContentsWrapper
          isLogined = { this.props.session.isLogined }
          menu={ this.props.menu }

          algorithmList={ this.props.content.list }
          algorithmDetail={ this.props.content.detail }

          onAlgorithmClick={ this.props.onAlgorithmClick }
        />
      </section>
    )
  }
}
import {
  algorithmRequestList,
} from '../actions/Algorithm';
const mapStateToProps = (state)=>{
  return {
    status:{
      session: state.Authorization.status,
      content: state.LeftContentControll.status, 
    },
    session:{
      isLogined: state.Authorization.isLogined,
    },
    content:{
      list: state.LeftContentControll.content,
      detail: state.RightContentControll.question.content
    }
  }
}
// store에 저장된 리듀서를 여기에 불러올꺼야 :: 액션 -> 리듀서 -> 
const mapDispatchToProps = (dispatch)=>{
  return {
    // 알고리즘 리스트 가져올 액션
    getAlgorithmList: ( myalgo )=>{ 
      return dispatch( algorithmRequestList( myalgo ) ); 
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftContainer);