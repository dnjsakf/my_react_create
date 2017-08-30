import React, { Component } from 'react';
import { 
  TabMenuWrapper,
  ContentsWrapper
 } from '../components/LeftComponent';

class LeftContainer extends Component{
  constructor(props){
    super(props);
    this.state = {
      id: 'Algorithm',
    }
    this.handleLeftTabMenu = this.handleLeftTabMenu.bind(this);
  }
  
  handleLeftTabMenu( event ){
    const id = event.target.value;
    this.setState({
      id,
    });
    console.log('[handleLeftTabMenu]',id);
  }
  

  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          onClick={ this.handleLeftTabMenu }
        />
        <ContentsWrapper
          id = { this.state.id }
        />
      </section>
    )
  }
}
export default LeftContainer

// { this.props.children }
