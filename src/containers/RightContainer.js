import React, { Component } from 'react';
import { TabMenuWrapper } from '../components/RightComponent';
import { ContentsWrapper } from '../components/RightComponent/RightContents';

import update from 'react-addons-update';

const consoleSwitch = true;

class RightContainer extends Component{
  render(){
    return (
      <section className="right-tab">
        <TabMenuWrapper
          menuTitles={ this.props.menuTitles }
          disableTitles={ this.props.disableTitles }
          onMenuClick={ this.props.onMenuClick }
        />
        <ContentsWrapper
          menu={ this.props.menu }
          content={ this.props.content }
          onAlgorithmSolve={ this.props.onAlgorithmSolve }
          />
      </section>
    )
  }
}
export default RightContainer;