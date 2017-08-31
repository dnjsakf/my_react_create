import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

import update from 'react-addons-update';

import { connect } from 'react-redux';

class RightContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      left:{
        content: '',
        status: 'INIT',
        data: [],
        selected: 0,
      },
      right:{
        content: '',
        status: 'INIT',
        data: [],
      }
    }

    this.handleRightTebMenu = this.handleRightTebMenu.bind(this);
  }
  
  handleRightTebMenu( event ){
    console.log('[right-tab-menu]', event.target.value);
    this.setState(
      update(this.state, 
        {
          right: {
            content: { $set: event.target.value } 
          }
        }
      )
    );
  }
  shouldComponentUpdate(nextProps, nextState){
    let update = this.state.right.content !== nextState.right.content;    // 탭을 선택하면.
    update = update || this.state.right.data !== nextState.right.data;
    return update;
  }
  
  render(){
    return (
      <section className="right-tab">
        <TabMenuWrapper
          changeRightTab = { this.handleRightTebMenu }
        />
        <ContentsWrapper
          id = { this.state.right.content }
          data = { this.props.right.data }
        />
      </section>
    )
  }
}

import { algorithmRequestData } from '../actions/Algorithm';
const mapStateToProps = (state)=>{
  console.log('right-map-state-to-props', state)
  return {
    right:{
      status: state.RightContentControll.status,
      data: state.RightContentControll.data
    }
    // 여기서 right를 호출하려 했더니, 리로딩 되면서 이 데이터가 바뀌어 버림.
  };
}
const mapDispatchToProps = (dispatch)=>{
  return {
    // getAlgorithmData: (questionNo)=>{
    //   return dispatch( algorithmRequestData( questionNo ) );
    // }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightContainer);