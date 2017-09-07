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
    if( this.props.content.status === 'INIT' ){
      if( this.props.menu.toLowerCase() === 'algorithm'){
        console.log('[left-will-mount]', this.props.content.status);
        this.props.getAlgorithmList('list'); 
      }
    }
  }
  componentDidMount(){
    console.log('[left-did-mount]');
  }

  componentWillReceiveProps(nextProps){
    console.log('[left-receive]');
    const nextMenu = nextProps.menu.toLowerCase();
    const prevMenu = this.props.menu.toLowerCase();

    if( nextMenu !== prevMenu ){
      switch( nextMenu ){
        case 'algorithm':
          this.props.getAlgorithmList('list');
          break;
        case 'myalgorithm':
          this.props.getAlgorithmList('myalgo');
          break;
        default:
          return false;
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if( nextProps.session.status === 'WAITING' ) return false;
    if( nextProps.content.status === 'WAITING' ) return false;
    return true;
  }

  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          isLogined = { this.props.session.isLogined }
          menuTitles={ this.props.menuTitles }
          disableTitles={ this.props.disableTitles }
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
    session:{
      status: state.Authorization.status,
      isLogined: state.Authorization.isLogined,
    },
    content:{
      status: state.LeftContentControll.status, 
      list: state.LeftContentControll.content,
      detail: state.RightContentControll.content
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