import React, { Component } from 'react';
import Header from './HeaderContainer';
import Section from './SectionContainer';

class MainApp extends Component{
  render(){
    return (
      <section>
        <Header/>
        <Section/>
      </section>
    )
  }
}
export default MainApp