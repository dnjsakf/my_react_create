import React, { Component } from 'react';
import update from 'react-addons-update';

import { 
  TabMenuWrapper,
  ContentsWrapper
 } from '../components/LeftComponent';

class LeftContainer extends Component{
  render(){
    return (
      <section className="left-tab">
        <TabMenuWrapper
          isLogined = { this.props.isLogined }
          menuTitles={ this.props.menuTitles }
          disableTitles={ this.props.disableTitles }
          onMenuClick={ this.props.onMenuClick }
        />
        <ContentsWrapper
          isLogined = { this.props.isLogined }
          menu={ this.props.menu }
          content={ this.props.content }
          onAlgorithmClick={ this.props.onAlgorithmClick }
        />
      </section>
    )
  }
}
export default LeftContainer;