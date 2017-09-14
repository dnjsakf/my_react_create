import { combineReducers } from 'redux';

import LeftContent from './rdLeftContent';
import RightContent from './rdRightContent';
import Authorization from './rdAuthorization';
import UserState from './rdUserState';
import AdminNotice from './rdNotice';
import Compile from './rdCompile';

const reducers = combineReducers({
  LeftContent,
  RightContent,
  Authorization,
  UserState,
  AdminNotice,
  Compile
});

export default reducers;