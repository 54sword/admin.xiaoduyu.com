
import graphql from './common/graphql'

/**
 * [添加] 验证码
 * @param  {String} id
 * @param  {Object} [args={}]  参数
 * @param  {String} [fields=``] 返回字段
 * @return {Object} promise
 */
export const addCaptcha = ({ id = new Date().getTime(), args, fields = `success`  }) => {
  return (dispatch, getState) => {
    return new Promise(async (resolve)=> {

      let accessToken = accessToken || getState().user.accessToken;

      let [ err, res ] = await graphql({
        type: 'mutation',
        api: 'addCaptcha',
        args,
        fields,
        headers: accessToken ? { 'AccessToken': accessToken } : null
      });

      if (res && res._id && res.url) {
        dispatch({ type: 'ADD_CAPRCHA_ID', id, data: res });
      }

      resolve([ err, res ])

    })

  }
}


/*
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

      // let accessToken = getState().user.accessToken

      let sql = `
      mutation {
        addCaptcha(type:"sign-in"){
          _id
          url
        }
      }
      `

      // console.log({ 'Test': new Date().getTime() });

      let [ err, res ] = await grapgQLClient({
        query:sql,
        // headers: { 'Test': new Date().getTime() },
        fetchPolicy: 'network-only'
      })

      console.log(err);
      console.log(res);

      if (err) {
        reject([err])
      } else {
        resolve([null, res.data.captcha])
      }

    })

  }
}
*/
/*
export function addCaptchaByIP(callback) {
  return (dispatch, getState) => {
    return Ajax({
      url:'/add-captcha-by-ip',
      type: 'get',
      callback
    })
  }
}
*/
