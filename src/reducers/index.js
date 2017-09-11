import { combineReducers } from 'redux';

import LeftContentControll from './rdLeftContent';
import RightContentControll from './rdRightContent';
import Authorization from './rdAuthorization';
import UserState from './rdUserState';
import AdminNotice from './rdNotice';
import Compile from './rdCompile';

const reducers = combineReducers({
  LeftContentControll,
  RightContentControll,
  Authorization,
  UserState,
  AdminNotice,
  Compile
});

export default reducers;