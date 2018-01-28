import Ajax from '../common/ajax'
// import merge from 'lodash/merge'
import { DateDiff } from '../common/date'

import loadList from './common/load-list'

export function loadBroadcastList({ name, filters = {}, restart = false }) {
  return (dispatch, getState) => {
    return loadList({
      dispatch,
      getState,

      name,
      restart,
      filters,

      processList: processData,

      reducerName: 'broadcast',
      api: '/notifications',
      type: 'post',
      actionType: 'SET_BROADCAST_LIST_BY_NAME',

      callback: (res) =>{

      }
    })
  }
}

export function updateBroadcast({ query = {}, update = {}, options = {} }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url: '/notification/update',
      type: 'post',
      data: { query, update, options },
      headers: { 'AccessToken': accessToken }
    }).then((result) => {
      if (result && result.success) {
        dispatch({ type: 'UPDATE_BROADCAST', id: query._id, update })
      }
    })
  }
}


// 加工问题列表
const processData = (list) => {
  list.map(function(item){
    item._create_at = DateDiff(item.create_at)
  })
  return list
}
