import {
  GET_ALGORITHM_DATA,
  GET_ALGORITHM_DATA_FAILURE,
  GET_ALGORITHM_DATA_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  content: 'home',
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
          content: { $set: action.content },
          status: { $set: 'waiting' },
        }
      );
    
    case GET_ALGORITHM_DATA_FAILURE:
      return update( state,
        {
          content: { $set: action.content },
          status: { $set: 'ERROR' },
          data: { $set: action.error }          
        }
      );
    
    case GET_ALGORITHM_DATA_SUCCESS:
      return update( state,
        {
          content: { $set: action.content },
          status: { $set: 'SUCCESS' },
          data: { $set: action.data }          
        }
      );
      
    default:
      return state;
  }
}