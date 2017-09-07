import {
  GET_ALGORITHM_DATA_WAITING,
  GET_QUESTION_STATE_WAITING,

  GET_ALGORITHM_DATA_FAILURE,
  GET_QUESTION_STATE_FAILURE,

  GET_ALGORITHM_DATA_SUCCESS,
  GET_QUESTION_STATE_SUCCESS,
} from '../actions/ActionTypes';

import update from 'react-addons-update';

const initialState = {
  status: 'INIT',
  content: 'INIT',
  question:{
    status: 'INIT',
    fields: 'INIT',
    state: 'INIT'
  }  
}

export default function RightContentControll(state, action){
  if(typeof state === 'undefined'){ state = initialState }

  switch(action.type){
    /**
     * WAITING
     */
    case GET_ALGORITHM_DATA_WAITING:
    case GET_QUESTION_STATE_WAITING:
    return update( state,
        {
          status: { $set: 'WAITING' },
        }
      );
    
    /**
     * FAILURE
     */
    case GET_ALGORITHM_DATA_FAILURE:
    case GET_QUESTION_STATE_FAILURE:
      return update( state,
        {
          status: { $set: 'ERROR' },
          content: { $set: action.error }          
        }
      );
    
    /**
     * SUCCESS
     */
    case GET_ALGORITHM_DATA_SUCCESS:
      return update( state,
        {
          status: { $set: 'SUCCESS' },
          content: { $set: action.data }          
        }
      );
    /**
     * action.data === question.state
     * 이거 수정해야되 꼭
     */
    case GET_QUESTION_STATE_SUCCESS:
      return update( state,
        {
          question: {
            status: { $set: 'SUCCESS' },
            fields: { $set: action.data.question.fields },
            state: { $set: action.data.question.state }
          }
        }
      )
      
    default:
      return state;
  }
}