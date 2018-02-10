import grapgQLClient from '../common/grapgql-client'

import Ajax from '../common/ajax'

export function addCaptcha(data, callback) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken
    return Ajax({
      url:'/get-captcha',
      type: 'post',
      data: data,
      headers: { AccessToken: accessToken },
      callback
    })
  }
}

export const getCaptchaId = () => {
  return (dispatch, getState) => {

    return new Promise(async (resolve, reject) => {

      let accessToken = getState().user.accessToken

      let sql = `
      {
        captcha{
          _id
          url
        }
      }
      `

      let [ err, res ] = await grapgQLClient({
        query:sql,
        headers: accessToken ? { 'AccessToken': accessToken } : null
      })

      if (err) {
        reject([err])
      } else {
        resolve([null, res.data.captcha])
      }

    })

    /*
    return new Promise(async (resolve, reject) => {
      Ajax({
        url: '/get-captcha-id',
        headers: { AccessToken: getState().user.accessToken }
      }).then(resolve).catch(reject)
    })
    */

  }
}

export function addCaptchaByIP(callback) {
  return (dispatch, getState) => {
    return Ajax({
      url:'/add-captcha-by-ip',
      type: 'get',
      callback
    })
  }
}
