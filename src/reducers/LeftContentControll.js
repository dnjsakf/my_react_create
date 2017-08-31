import {
  GET_ALGORITHM_LIST,
  GET_ALGORITHM_LIST_FAILURE,
  GET_ALGORITHM_LIST_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  content: 'algorithm',
  status: 'INIT',
  data: [],
  changeRightContent: false, 
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
          content: { $set: action.content },
          status: { $set: 'waiting' },
          changeRightContent: { $set: false }      
        }
      );
    
    case GET_ALGORITHM_LIST_FAILURE:
      return update( state,
        {
          content: { $set: action.content },
          status: { $set: 'ERROR' },
          data: { $set: action.error },
          changeRightContent: { $set: false }      
        }
      );
    
    case GET_ALGORITHM_LIST_SUCCESS:
      return update( state,
        {
          content: { $set: action.content },
          status: { $set: 'SUCCESS' },
          data: { $set: action.data },   
          changeRightContent: { $set: true }
        }
      );
      
    default:
      return state;
  }
}