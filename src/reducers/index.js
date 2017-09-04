import { combineReducers } from 'redux';

import LeftContentControll from './LeftContentControll';
import RightContentControll from './RightContentControll';
import Authorization from './Authorization';
import UserState from './UserState';

const reducers = combineReducers({
  LeftContentControll,
  RightContentControll,
  Authorization,
  UserState,
});

export default reducers;