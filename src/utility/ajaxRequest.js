import axios from 'axios';

export function get(url, data){
  return axios.get(url, data);  
}
export function post(url, data){
  return axios.post(url, data)
}