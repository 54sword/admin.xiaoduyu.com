
import config from '../../config'
import errors from '../../config/errors'
import axios from 'axios'
// import Promise from 'promise'


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

const AJAX = ({ domain = config.api_url, url = '', type = 'get', data = {}, headers = {} }) => {

  let option = {
    url: domain + '/' + config.api_verstion + url,
    method: type
  }

  if (type == 'get') {
    data._t = new Date().getTime()
    option.params = data
  } else if (type == 'post') {
    option.data = data
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  if (type == 'post' && headers.AccessToken) {
    option.data.access_token = headers.AccessToken
    delete option.headers
  }


  if (__DEV__) console.debug(option)

  return axios(option).then(resp => {
    if (__DEV__) console.debug(resp.data)

    if (resp && resp.data) {
      let res = resp.data
      res = converterErrorInfo(res)
      // resolve(res)
      return res
    } else {
      return null
      // reject(null)
    }

  })
  .catch(function (error) {
    if (__DEV__) console.debug(error.response.data)

    if (error && error.response && error.response.data) {
      let res = error.response.data
      res = converterErrorInfo(res)
      return res
      // resolve(res)
    } else {
      return null
      // reject(null)
    }

  })

  // })
}

export default AJAX
