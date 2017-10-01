import {
  COMPILE_WAITING,
  COMPILE_SUCCESS,
  COMPILE_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  success: 'INIT',
  result: 'INIT'
}

export default function CompileReducer(state, action){
  if( typeof state === 'undefined' ) state = initialState;

  switch( action.type ){
    case COMPILE_WAITING:
      return update( state, 
        {
          status: { $set: 'WAITING' },
        }
      );
    case COMPILE_SUCCESS:
      return update( state, 
        {
          status: { $set: 'SUCCESS' },
          success: { $set: action.data.success },
          result: { $set: action.data.result }
        }
      );
    case COMPILE_FAILURE:
      return update( state, 
        {
          status: { $set: 'FAILURE' },
          result: { $set: action.error }
        }
      );

    default:
      return state;
  }
};