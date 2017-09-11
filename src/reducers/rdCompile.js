import {
  COMPILE_PYTHON_WAITING,
  COMPILE_PYTHON_SUCCESS,
  COMPILE_PYTHON_FAILURE
} from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  python:{
    status: 'INIT',
    result: 'INIT',
  },
}

export default function CompileReducer(state, action){
  if( typeof state === 'undefined' ) state = initialState;

  switch( action.type ){
    case COMPILE_PYTHON_WAITING:
      return update( state, 
        {
          python: {
            status: { $set: 'WAITING' },
          }
        }
      )
    case COMPILE_PYTHON_SUCCESS:
      return update( state, 
        {
          python: {
            status: { $set: 'SUCCESS' },
            result: { $set: action.data.result }
          }
        }
      )
    case COMPILE_PYTHON_FAILURE:
      return update( state, 
        {
          python: {
            status: { $set: 'FAILURE' },
            result: { $set: action.error }
          }
        }
      )

    default:
      return state;
  }
};