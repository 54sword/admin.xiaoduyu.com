import Ajax from '../common/ajax'
import Promise from 'promise'

function setUser(userinfo) {
  return { type: 'SET_USER', userinfo }
}

export function removeAccessToken() {
  return { type: 'REMOVE_ACCESS_TOKEN' }
}

export const loadUserInfo = ({ accessToken = null }) => {
  return (dispatch, getState) => {

    accessToken = accessToken || getState().user.accessToken


    return new Promise((resolve, reject) => {

      return Ajax({
        url: '/user',
        type: 'post',
        headers: { AccessToken: accessToken }
      }).then(res => {
        if (res && res.success) {
          dispatch({ type: 'SET_USER', userinfo: res.data })
        }
        resolve(res)
      }).catch(reject)

    })

  }
}

export function resetAvatar({ avatar, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-avatar',
      type: 'post',
      data: { avatar: avatar },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function resetNickname({ nickname, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-nickname',
      type: 'post',
      data: { nickname: nickname },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function resetGender({ gender, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-gender',
      type: 'post',
      data: { gender: gender },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}

export function resetBrief({ brief, callback }) {
  return (dispatch, getState) => {
    let accessToken = getState().user.accessToken

    return Ajax({
      url: '/reset-brief',
      type: 'post',
      data: { brief: brief },
      headers: { AccessToken: accessToken },
      callback
    })

  }
}
