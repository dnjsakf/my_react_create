import React, { Component } from 'react';

class SectionContainer extends Component{
  render(){
    return (
      <section className="main-section">
        { this.props.children }
      </section>
    )
  }
}
export default SectionContainer