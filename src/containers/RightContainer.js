import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

import update from 'react-addons-update';

import { connect } from 'react-redux';

class RightContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      fromLeft: false,
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
          fromLeft: { $set: false },
          right: {
            content: { $set: event.target.value } 
          }
        }
      )
    );
  }

  componentDidMount(){
    console.log('[right-did-mount]', this.props.right.change)
    if(this.props.right.change){
      this.setState(update(this.state, {
        fromLeft: { $set: this.props.right.change }
      }));
    }
  }
  // 이게 저기 mapStateToProps에서 받는거넹
  componentWillReceiveProps(nextProps){
    console.log('[props받았따]', nextProps)
    if(this.props.right.change){
      this.setState(update(this.state, {
        fromLeft: { $set: this.props.right.change }
      }));
    }
  }
  componentWillUpdate(){
    console.log('이거 업데이트됨?')
    
  }
 
  // shouldComponentUpdate(nextProps, nextState){
  //   const update = JSON.stringify(this.state.right) !== JSON.stringify(nextState.right);
  //   return update;
  // }

  
  render(){
    let nextContentPage = '';
    if( this.state.fromLeft ){
      nextContentPage = this.props.right.changeContent;
    } else {
      nextContentPage = this.state.right.content;
    }

    console.log('[right-render]', this.state.right.content);
    console.log('[right-render]', this.state.fromLeft, this.props.right.changeContent);
    return (
      <section className="right-tab">
        <TabMenuWrapper
          changeRightTab = { this.handleRightTebMenu }
        />
        <ContentsWrapper
          id = { nextContentPage }
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
      change: state.LeftContentControll.changeRightContent,
      changeContent: state.LeftContentControll.content,
      content: state.LeftContentControll.content,
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