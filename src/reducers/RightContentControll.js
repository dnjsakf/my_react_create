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
  question:{
    status: 'INIT',
    content: 'INIT',
  },
  dashboard:{
    status: 'INIT',
    state: 'INIT',
    count: 0
  }  
}

export default function RightContentControll(state, action){
  if(typeof state === 'undefined'){ state = initialState }

  switch(action.type){
    /**
     * WAITING
     */
    case GET_ALGORITHM_DATA_WAITING:
      return update( state,
        {
          question:{
            status: { $set: 'WAITING' },
          }
        }
      );
    case GET_QUESTION_STATE_WAITING:
      return update( state,
        {
          dashboard:{
            status: { $set: 'WAITING' }
          },
        }
      );
    /**
     * FAILURE
     */
    case GET_ALGORITHM_DATA_FAILURE:
      return update( state,
        {
          question:{
            status: { $set: 'ERROR' },
          }
        }
      );
    case GET_QUESTION_STATE_FAILURE:
      return update( state,
        {
          dashboard:{
            status: { $set: 'ERROR' },
            records: { $set: 'INIT' },
            count: { $set: 0 }
          }
        }
      );
    
    /**
     * SUCCESS
     */
    case GET_ALGORITHM_DATA_SUCCESS:
      return update( state,
        {
          question:{
            status: { $set: 'SUCCESS' },
            content: { $set: action.data }
          }
        }
      );
    /**
     * action.data === question.state
     * 이거 수정해야되 꼭
     */
    case GET_QUESTION_STATE_SUCCESS:
      return update( state,
        {
          dashboard: {
            status: { $set: 'SUCCESS' },
            records: { $set: action.data.records },
            maxPage: { $set: action.data.maxPage }
          }
        }
      )
      
    default:
      return state;
  }
}