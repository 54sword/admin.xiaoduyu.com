import Ajax from '../common/ajax'

// 登录
export function getQiNiuToken() {
  return (dispatch, getState) => {

    const accessToken = getState().user.accessToken
    return new Promise((resolve, reject) => {
      Ajax({
        url: '/get-qiniu-token',
        type: 'post',
        headers: { AccessToken: accessToken }
      }).then(resolve).catch(reject)
    })

  }
}
