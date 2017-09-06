import { combineReducers } from 'redux';

import LeftContentControll from './LeftContentControll';
import RightContentControll from './RightContentControll';
import Authorization from './Authorization';
import UserState from './UserState';
import AdminNotice from './AdminNotice';

const reducers = combineReducers({
  LeftContentControll,
  RightContentControll,
  Authorization,
  UserState,
  AdminNotice
});

export default reducers;