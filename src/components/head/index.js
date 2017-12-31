import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { signOut } from '../../actions/sign'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

import connectReudx from '../../common/connect-redux'

export class Head extends React.Component {

  static mapStateToProps = () => {
    return {}
  }

  static actions = { signOut }

  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  componentDidMount() {
    console.log(this);
  }

  async signOut() {
    let result = await this.props.signOut()
    // console.log(result);
    // console.log('退出成功');
    if (result.success) {
      location.reload()
    }
  }

  render() {
    return(<div>
      <div className="flex-center">
        <div styleName="head" className="container-fluid">
          <NavLink exact to="/">小度鱼后台管理</NavLink>
          <div styleName="right"><a href="javascript:void(0)" onClick={this.signOut}>退出</a></div>
        </div>
      </div>
      <div styleName="placeholder"></div>
    </div>)
  }

}

Head = CSSModules(Head, styles)

Head = connectReudx(Head)

export default Head
