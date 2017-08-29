import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/LeftComponent'

class LeftContainer extends Component{
  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper/>
        { this.props.children }
      </section>
    )
  }
}
export default LeftContainer