
import config from '../../config'
import errors from '../../config/errors'
import axios from 'axios'
import Promise from 'promise'

const converterErrorInfo = (res) => {

  if (res.error) {
    res._error = res.error
    if (typeof(res.error) == 'number') {
      res.error = errors[res.error] || '未知错误: '+res.error
    } else {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]
      }
    }
  }

  // 参数替换
  if (res.error_data) {

    if (typeof(res.error) == 'string') {
      res.error = res.error.format(res.error_data);
    } else if (typeof(res.error) == 'object') {
      for (let i in res.error) {
        res.error[i] = errors[res.error[i]] || '未知错误: '+res.error[i]
        res.error[i] = res.error[i].format(res.error_data);
      }
    }

  }

  return res

}

const AJAX = ({ api_url = '', url = '', type = 'get', params = {}, data = {}, headers = {} }) => {

  return new Promise((resolve, reject) => {

  let option = {
    url: config.api_url + '/' + config.api_verstion + url,
    method: type
  }

  if (!api_url) option.url = config.api_url + '/' + config.api_verstion + url
  if (api_url) option.url = api_url + url

  if (type == 'get') {
    params._t = new Date().getTime()
    option.params = params
  } else if (type == 'post') {
    option.data = data
  }

  // let token

  if (headers && headers.AccessToken) {
    option.headers = headers
    // token = headers.AccessToken
  }

  if (type == 'post' && headers.AccessToken) {
    option.data.access_token = headers.AccessToken
    // token = option.data.access_token
    delete option.headers
  }

  // console.log(option);
  // console.log(token);
  // if (config.debug && console.debug) console.debug('请求: ', option)

  return axios(option).then(resp => {
    // if (config.debug && console.debug) console.debug('返回: ', resp)

    if (resp && resp.data) {
      let res = resp.data
      res = converterErrorInfo(res)
      // callback(res)
      resolve(res)
    } else {
      reject(null)
    }

  })
  .catch(function (error) {
    // if (config.debug && console.debug) console.error('返回: ', error)

    if (error && error.response && error.response.data) {
      let res = error.response.data
      res = converterErrorInfo(res)
      // callback(res)
      resolve(res)
    } else {
      reject(null)
    }

  })

  })
}

export default AJAX
