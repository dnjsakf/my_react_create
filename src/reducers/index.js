import { combineReducers } from 'redux';

import LeftContentControll from './LeftContentControll';
import RightContentControll from './RightContentControll';

const reducers = combineReducers({
  LeftContentControll,
  RightContentControll,
});

export default reducers;