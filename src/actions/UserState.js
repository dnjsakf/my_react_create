import {
  USERSTATE_INSERT_WAITING,
  USERSTATE_UPDATE_WAITING,
  USERSTATE_DELETE_WAITING,

  USERSTATE_INSERT_SUCCESS,
  USERSTATE_UPDATE_SUCCESS,
  USERSTATE_DELETE_SUCCESS,

  USERSTATE_INSERT_FAILURE,
  USERSTATE_UPDATE_FAILURE,
  USERSTATE_DELETE_FAILURE,
} from './ActionTypes';

import axios from 'axios';

/**
 * UserState Insert Event
 */
export function userStateInsertRequest( insertData ){
  return ( dispatch )=>{
    
    dispatch(userStateWaiting('insert'));

    return axios.put('/api/userstate/insert', insertData )
          .then((response)=>{
            console.log('[\nuserstate-insert-success]', response, '\n');
            dispatch(userStateSuccess('insert', response.data));
          })
          .catch((error)=>{
            console.error('[\nuserstate-insert-failure]', error.response.data.error, '\n');
            dispatch(userStateFailure('insert', error.response.data.error));
          });
  }
}

/**
 * UserState Update Event
 */
export function userStateUpdateRequest( mode, updateData ){
  return ( dispatch )=>{
    
    console.log(mode, updateData);
    dispatch(userStateWaiting('update'));

    return axios.post(`/api/userstate/update/${mode}`, updateData )
          .then((response)=>{
            console.log('[\nuserstate-update-success]', response, '\n');
            dispatch(userStateSuccess('update', response.data));
          })
          .catch((error)=>{
            console.error('[\nuserstate-update-failure]', error.response.data.error, '\n');
            dispatch(userStateFailure('update', error.response.data.error));
          });
  }
}

/**
 * UserState Delete Event
 */
export function userStateDeleteRequest( deleteData ){
  return ( dispatch )=>{
    
    dispatch(userStateWaiting('delete'));

    return axios.delete('/api/userstate/delete', deleteData )
          .then((response)=>{
            console.log('[\nuserstate-delete-success]', response, '\n');
            dispatch(userStateSuccess('delete', response.data));
          })
          .catch((error)=>{
            console.error('[\nuserstate-delete-failure]', error.response.data.error, '\n');
            dispatch(userStateFailure('delete', error.response.data.error));
          });
  }
}


export function userStateWaiting( mode ){
  switch(mode){
    case 'insert':
      return {
        type: USERSTATE_INSERT_WAITING
      }
    case 'update':
      return {
        type: USERSTATE_UPDATE_WAITING
      }
    case 'delete':
      return {
        type: USERSTATE_DELETE_WAITING
      }
  }
}

export function userStateSuccess( mode, completed ){
  switch(mode){
    case 'insert':
      return {
        type: USERSTATE_INSERT_SUCCESS
      }
    case 'update':
      return {
        type: USERSTATE_UPDATE_SUCCESS
      }
    case 'delete':
      return {
        type: USERSTATE_DELETE_SUCCESS
      }
  }
}

export function userStateFailure( mode, error ){
  switch(mode){
    case 'insert':
      return {
        type: USERSTATE_INSERT_FAILURE
      }
    case 'update':
      return {
        type: USERSTATE_UPDATE_FAILURE
      }
    case 'delete':
      return {
        type: USERSTATE_DELETE_FAILURE
      }
  }
}