import {
  GET_ALGORITHM_DATA,
  GET_ALGORITHM_DATA_FAILURE,
  GET_ALGORITHM_DATA_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  content: [],
}

export default function RightContentControll(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }
  switch(action.type){
    case GET_ALGORITHM_DATA:
      return update( state,
        {
          status: { $set: 'waiting' },
        }
      );
    
    case GET_ALGORITHM_DATA_FAILURE:
      return update( state,
        {
          status: { $set: 'ERROR' },
          content: { $set: action.error }          
        }
      );
    
    case GET_ALGORITHM_DATA_SUCCESS:
      return update( state,
        {
          status: { $set: 'SUCCESS' },
          content: { $set: action.data }          
        }
      );
      
    default:
      return state;
  }
}