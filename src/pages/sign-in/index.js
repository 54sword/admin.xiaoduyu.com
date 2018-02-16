import React from 'react'
import { Route, Link } from 'react-router-dom'

import { signIn, saveSignInCookie } from '../../actions/sign'
import { getCaptchaId } from '../../actions/captcha'
import { getProfile } from '../../reducers/user'

// import Promise from 'promise'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import config from '../../../config'

import Shell from '../shell'


// 纯组件
export class SignIn extends React.Component {

  /*
  static loadData({ store, match, userinfo }) {

    return new Promise(function (resolve, reject) {

      // console.log(userinfo);

      // setTimeout(function () {
        // store.dispatch(update('777'))
        resolve({ code:200, resr: '123' });
      // }, 3000);
    })

  }
  */

  // 从 state 从获取数据到 props
  static mapStateToProps(state, props) {
    return {
      profile: getProfile(state)
    }
  }

  // 异步操作
  static mapDispatchToProps = { signIn, getCaptchaId, saveSignInCookie }

  constructor(props) {
    super(props)
    this.state = {
      captchaId: '',
      captchaUrl: ''
    }
    this.submit = this.submit.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {
    this.getCaptcha()
  }

  async getCaptcha() {

    // console.log('123');

    const { getCaptchaId } = this.props
    let [ err, res ] = await getCaptchaId()

    if (!err && res._id) {
      this.setState({ captchaId: res._id, captchaUrl: res.url })
    }
  }

  async submit(event) {

    event.preventDefault()

    const { signIn, saveSignInCookie } = this.props
    const { account, password, submit, captcha } = this.refs
    const { captchaId } = this.state

    if (!account.value) return account.focus()
    if (!password.value) return password.focus()

    submit.value = '登录中...'
    submit.disabled = true

    let data = {
      email: account.value.indexOf('@') != -1 ? account.value : '',
      phone: account.value.indexOf('@') == -1 ? account.value : '',
      password: password.value,
      captcha: captcha && captcha.value || '',
      captcha_id: captchaId || ''
    }

    let err = await signIn({ data })

    submit.value = '登录'
    submit.disabled = false

    if (err) {

      Toastify({
        text: err,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();

      this.getCaptcha()

      // toast.warn(result.error)
    } else {
      let result = await saveSignInCookie()
      if (result.success) {
        location.reload()
      } else {

        Toastify({
          text: 'cookie 储存失败',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
        }).showToast();
        // toast.warn('cookie 储存失败')
      }
    }

    return false
  }

  render() {

    const { captchaId, captchaUrl } = this.state

    return(<div className="text-center" styleName="container">

      <form className="form-signin" onSubmit={this.submit}>

        <h1 className="h3 mb-3 font-weight-normal">登陆小度鱼后台</h1>

        <div className="form-group">
          <input ref="account" type="text" className="form-control" placeholder="邮箱或手机号" />
        </div>

        <div className="form-group">
          <input ref="password" type="password" className="form-control" placeholder="密码" />
        </div>

        {captchaId ?
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="请输入验证码" ref="captcha" />
            <div className="input-group-append" styleName="captcha">
              <span className="input-group-text">
                <img onClick={this.getCaptcha} src={`${captchaUrl}`} />
              </span>
            </div>
          </div>
          : null}

        <div className="form-group">
          <button ref="submit" type="submit" className="btn btn-lg btn-primary btn-block">登录</button>
        </div>

      </form>

    </div>)
  }

}

SignIn = CSSModules(SignIn, styles)

export default Shell(SignIn)
