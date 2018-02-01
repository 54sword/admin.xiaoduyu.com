// import Ajax from '../../common/ajax'

import grapgQLClient from '../../common/grapgql-client'
import merge from 'lodash/merge'


export default ({
  dispatch, getState, reducerName,
  name, api, actionType, restart,
  filters,
  type = 'get',
  processList = data => data,
  callback = ()=>{}
}) => {
  return new Promise(async (resolve, reject) => {

    let select = filters.select || ``
    filters = filters.variables || {}

    let state = getState(),
        accessToken = state.user.accessToken,
        list = state[reducerName][name] || {}

    // 让列表重新开始
    if (restart) list = {}

    // 如果没有更新数据，或正在加载中，则拒绝请求
    if (typeof list.more != 'undefined' && !list.more || list.loading) {
      resolve()
      return
    }

    if (!Reflect.has(list, 'data')) list.data = []

    if (!Reflect.has(list, 'filters')) {
      if (!Reflect.has(filters, 'page_number')) filters.page_number = 0
      if (!Reflect.has(filters, 'page_size')) filters.page_size = 15

      filters.page_number = parseInt(filters.page_number)
      filters.page_size = parseInt(filters.page_size)

      list.filters = filters
    } else {
      // 如果以及存在筛选条件，那么下次请求，进行翻页
      filters = list.filters
      filters.page_number += 1
    }

    list.more = true
    list.loading = true

    dispatch({ type: actionType, name, data: list })

    let headers = accessToken ? { 'AccessToken': accessToken } : null

    let variables = []

    console.log(filters);

    for (let i in filters) {

      let v = ''

      switch (typeof filters[i]) {
        case 'string':
          v = '"'+filters[i]+'"'
          break
        case 'number':
          v = filters[i]
          break
        default:
          v = filters[i]
          break
      }

      variables.push(i+':'+v)
    }

    let sql = `{
      posts(${variables}){ ${select} }
    }`

    let [ err, res ] = await grapgQLClient({ ql:sql, headers })

    if (err) return resolve(err)

    let data = res.data.posts

    list.more = data.length < list.filters.page_size ? false : true

    list.data = list.data.concat(processList(merge([], data, [])))
    list.filters = filters
    // list.count = 0
    list.loading = false

    dispatch({ type: actionType, name, data: list })
    resolve(res)

  })

}
