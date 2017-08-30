import React, { Component } from 'react';

import { render } from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

// applyMiddleware
// thunk
// 이 녀석들이 없으면 action에서 plain object로
// action을 사용할 수 있음. 


import {
  HeaderContainer as Header,
  SectionContainer as Section,
  LeftContainer as LeftTab,
  RightContainer as RightTab,
  FooterContainer as Footer,
} from './containers';

const store = createStore(reducers, applyMiddleware(thunk));
// const unsubscribe = store.subscribe(()=>{
//   console.log('[store-state]', store.getState());
// });

render(
  <Provider store={ store }>
    <div>
      <Header/>
      <Section>
        <LeftTab/>
        <RightTab/>
      </Section>
    </div>
  </Provider>
  ,
  document.getElementById('root')
);