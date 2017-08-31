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
    this.state = {
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

    this.handleLeftTabMenu = this.handleLeftTabMenu.bind(this);
    this.handleClickSubject = this.handleClickSubject.bind(this);
  }
  
  // contents만 바꿔줌
  handleLeftTabMenu( event ){
    console.log('[left-tab-menu]', event.target.value);
    const menu = (event.target.value).toLowerCase();
    if( menu === 'algorithm' ){
      this.props.getAlgorithmList().then(()=>{
        this.setState(
          update(this.state, {
              left:{
                content: { $set: menu }
              }
          })
        );
      })
    } else {
      this.setState(
        update(this.state, {
          left:{
            content: { $set: menu }
          }
        })
      );
    }
  }
  handleClickSubject( questionNo ){
    if( typeof questionNo === 'number' && questionNo > 0){
      console.log('[left-subject-click]', questionNo);
     
      this.props.getAlgorithmData(questionNo).then(()=>{
        this.setState(
          update(this.state, {
            left:{
              selected: { $set: questionNo }
            },
          })
        );
      });
    }
  }
  
  shouldComponentUpdate(nextProps, nextState){
    const update = (this.state.left.content !== nextState.left.content) || (this.state.left.selected !== nextState.left.selected)
    return update;
  }

  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          changeLeftTab = { this.handleLeftTabMenu }
        />
        <ContentsWrapper
          id = { this.state.left.content }
          content = { this.props.left.data }
          getAlgorithmDetail = { this.handleClickSubject }
        />
      </section>
    )
  }
}


// import * as actions from '../actions';
import { 
  algorithmRequestList,
  algorithmRequestData,
} from '../actions/Algorithm';

const mapStateToProps = (state)=>{
  console.log('[map-state-to-props]', state);
  return {
    left:{
      status: state.LeftContentControll.status,
      data: state.LeftContentControll.data,
    },
    // 여기서 right를 호출하려 했더니, 리로딩 되면서 이 데이터가 바뀌어 버림.
  };
}
const mapDispatchToProps = (dispatch)=>{
  return {
    getAlgorithmList: ()=>{ 
      return dispatch( algorithmRequestList() );
    },
    getAlgorithmData: ( questionNo )=>{
      return dispatch( algorithmRequestData( questionNo ) );
    }
    // more action
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftContainer);