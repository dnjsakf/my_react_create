import {
  GET_ALGORITHM_LIST,
  GET_ALGORITHM_LIST_FAILURE,
  GET_ALGORITHM_LIST_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  data: [],
}

export default function LeftContetnControll(state, action){
  console.log('[reducer-left]', action);
  if(typeof state === 'undefined'){
    state = initialState;
  }
  switch(action.type){
    case GET_ALGORITHM_LIST:
      return update( state,
        {
          status: { $set: 'waiting' },
        }
      );
    
    case GET_ALGORITHM_LIST_FAILURE:
      return update( state,
        {
          status: { $set: 'ERROR' },
          data: { $set: action.error }          
        }
      );
    
    case GET_ALGORITHM_LIST_SUCCESS:
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