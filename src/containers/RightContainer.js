import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/RightComponent';

class RightContainer extends Component{
  render(){
    return (
      <section className="right-tab">
        <TabMenuWrapper/>
      </section>
    )
  }
}
export default RightContainer