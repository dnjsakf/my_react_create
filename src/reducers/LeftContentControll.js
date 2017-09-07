import {
  GET_ALGORITHM_LIST_WAITING,
  GET_ALGORITHM_LIST_FAILURE,
  GET_ALGORITHM_LIST_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  content: [],
}

export default function LeftContetnControll(state, action){
  if(typeof state === 'undefined'){
    state = initialState;
  }
  switch(action.type){
    case GET_ALGORITHM_LIST_WAITING:
      return update( state,
        {
          status: { $set: 'WAITING' },
        }
      );
    
    case GET_ALGORITHM_LIST_FAILURE:
      return update( state,
        {
          status: { $set: 'ERROR' },
          content: { $set: action.error },
        }
      );
    
    case GET_ALGORITHM_LIST_SUCCESS:
      return update( state,
        {
          status: { $set: 'SUCCESS' },
          content: { $set: action.data },   
        }
      );
      
    default:
      return state;
  }
}