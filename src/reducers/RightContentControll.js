import {
  GET_ALGORITHM_DATA,
  GET_ALGORITHM_DATA_FAILURE,
  GET_ALGORITHM_DATA_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  data: [],
}

export default function RightContentControll(state, action){
  console.log('[reducer-right]', action);
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
          data: { $set: action.error }          
        }
      );
    
    case GET_ALGORITHM_DATA_SUCCESS:
      return update( state,
        {
          status: { $set: 'SUCCESS' },
          data: { $set: action.data }          
        }
      );
      
    default:
      return state;
  }
}