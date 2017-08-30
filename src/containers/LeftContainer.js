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
      content: 'algorithm',
      data: ''
    }
    this.data = [];

    this.handleLeftTabMenu = this.handleLeftTabMenu.bind(this);
  }
  
  // contents만 바꿔줌
  handleLeftTabMenu( event ){
    this.setState({
      content: event.target.value
    });
  }
  
  // 이렇게 설정하면
  // 최초의 1회가 출력이 안되는게 문제...
  componentDidMount(){
    this.props.handleGetAlgorithm();
  }
  shouldComponentUpdate(nextProps, nextState){
    return this.state.content !== nextState.content;
    // return (JSON.stringify(nextState) !== JSON.stringify(this.state));
  }

  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          getAlgorithm = { this.handleLeftTabMenu }
        />
        <ContentsWrapper
          id = { this.state.content }
          subject = { this.props.data }
        />
      </section>
    )
  }
}


// import * as actions from '../actions';
import { algorithmRequest } from '../actions/Algorithm';
const mapStateToProps = (state)=>{
  return {
    status: state.AlgorithmList.status,
    data: state.AlgorithmList.data,
  };
}
const mapDispatchToProps = (dispatch)=>{
  return {
    handleGetAlgorithm: ()=>{ 
      // return dispatch( actions.Algorithm.algorithmRequest() );
      return dispatch( algorithmRequest() );
    },
    // more action
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftContainer);