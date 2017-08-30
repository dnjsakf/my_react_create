import React, { Component } from 'react';
import { render } from 'react-dom';

import {
  HeaderContainer as Header,
  SectionContainer as Section,
  LeftContainer as LeftTab,
  RightContainer as RightTab,
  FooterContainer as Footer,
} from './containers';

function test(){
  console.log('onclick test');
}

render(
  <div>
    <Header/>
    <Section>
      <LeftTab/>
      <RightTab/>
    </Section>
  </div>
  ,
  document.getElementById('root')
);