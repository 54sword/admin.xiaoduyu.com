
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

const AJAX = ({
    domain = config.api_url,
    apiVerstion = '/' + config.api_verstion,
    url = '',
    type = 'get',
    data = {},
    headers = {}
  }) => {

  // if (typeof apiVerstion == 'undefined') {
  //   apiVerstion = '/' + config.api_verstion
  // }

  let option = {
    url: domain + apiVerstion + url,
    method: type,
    dataType : 'json'
  }

  // 管理员查询
  // data.admin = 1

  if (type == 'get') {
    data._t = new Date().getTime()
    // data._t = parseInt(new Date().getTime()/8000)
    option.params = JSON.stringify(data)
  } else if (type == 'post') {
    option.data = JSON.stringify(data)
  }

  if (headers && headers.AccessToken) {
    option.headers = headers
  }

  headers['Accept'] = "application/json"
  headers['Content-Type'] = "application/json"

  // if (type == 'post' && headers.AccessToken) {
  //   option.data.access_token = headers.AccessToken
  //   delete option.headers
  // }


  if (typeof __DEV__ != 'undefined') {
    console.debug('[发起' + option.method  + '请求] '+option.url, data)
    // console.debug('[参数]', data)
  }

  return axios(option).then(resp => {
    if (typeof __DEV__ != 'undefined') console.debug('[结果] '+option.url, resp.data)

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
    if (typeof __DEV__ != 'undefined') console.warn('[结果] '+option.url, error.response.data)

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
