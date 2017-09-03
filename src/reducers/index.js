import { combineReducers } from 'redux';

import LeftContentControll from './LeftContentControll';
import RightContentControll from './RightContentControll';
import Authorization from './Authorization';

const reducers = combineReducers({
  LeftContentControll,
  RightContentControll,
  Authorization,
});

export default reducers;