import React from 'react'
import { Route, Link } from 'react-router-dom'

// import PropTypes from 'prop-types'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
import { signIn, saveSignInCookie } from '../../actions/account'
import { getCaptchaId } from '../../actions/captcha'
import { getProfile } from '../../reducers/user'

import Promise from 'promise'
//
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import config from '../../../config'

import Shell from '../shell'

// import connectReudx from '../../common/connect-redux'

// 纯组件
export class SignIn extends React.Component {


  static loadData({ store, match, userinfo }) {

    return new Promise(function (resolve, reject) {

      // console.log(userinfo);

      // setTimeout(function () {
        // store.dispatch(update('777'))
        resolve({ code:200, resr: '123' });
      // }, 3000);
    })

  }

  // 异步操作
  static actions = { signIn, getCaptchaId, saveSignInCookie }

  // 从 state 从获取数据到 props
  static mapStateToProps(state, props) {
    return {
      profile: getProfile(state)
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      captchaId: ''
    }
    this.submit = this.submit.bind(this)
    this.getCaptcha = this.getCaptcha.bind(this)
  }

  componentDidMount() {

    console.log(this);

    this.getCaptcha()
  }

  async getCaptcha() {
    const { getCaptchaId } = this.props
    let result = await getCaptchaId()
    if (result && result.success && result.data) {
      this.setState({ captchaId: result.data })
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

    let result = await signIn({ data })

    submit.value = '登录'
    submit.disabled = false

    if (result && result.success) {
      result = await saveSignInCookie()
      console.log(result);
    }

    /*
    let result = signIn({
      data,
      callback: (result) => {

      submit.value = '登录'
      submit.disabled = false

      console.log(result);

      // if (!result.success) {
      //   _self.refreshCaptcha()
      //   _self.setState({ error: result.error })
      //   return;
      // }

      // setTimeout(()=>{
      //   location.reload()
      // }, 100)

    }})
    */


    return false
  }

  render() {

    const { captchaId } = this.state

    return(<div styleName="container">

      <h2>登陆小度鱼后台</h2>

      <form className="form" onSubmit={this.submit}>
        <input ref="account" type="text" placeholder="Email or Phone"/>
        <input ref="password" type="password" placeholder="Password"/>
        {captchaId ? <div>
            <input type="text" className="input" placeholder="请输入验证码" ref="captcha" />
            <img className={styles['captcha-image']} onClick={this.getCaptcha} src={`${config.api_url}/${config.api_verstion}/captcha-image/${captchaId}`} />
          </div> : null}
        <input ref="submit" className="btn" type="submit" value="登录"/>
      </form>


    </div>)
  }

}

SignIn = CSSModules(SignIn, styles)


SignIn.defaultProps = {
  test: '123'
  /*
  mapStateToProps: (state, props) => {
    return {}
  },
  mapDispatchToProps: (dispatch) => {
    return {
      signIn: bindActionCreators(signIn, dispatch),
      getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
      saveSignInCookie: bindActionCreators(saveSignInCookie, dispatch)
    }
  }
  */
}

// SignIn = connectReudx(SignIn)

// SignIn.propTypes = {
//   signIn: PropTypes.func.isRequired,
//   getCaptchaId: PropTypes.func.isRequired,
//   saveSignInCookie: PropTypes.func.isRequired
// }
/*
const mapStateToProps = (state, props) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: bindActionCreators(signIn, dispatch),
    getCaptchaId: bindActionCreators(getCaptchaId, dispatch),
    saveSignInCookie: bindActionCreators(saveSignInCookie, dispatch)
  }
}

SignIn = connect(mapStateToProps, mapDispatchToProps)(SignIn)
*/
export default Shell(SignIn)
