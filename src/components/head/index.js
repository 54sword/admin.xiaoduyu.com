import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { signOut } from '../../actions/sign'
import { getProfile } from '../../reducers/user'

import CSSModules from 'react-css-modules'
// import styles from './style.scss'

import connectReudx from '../../common/connect-redux'

export class Head extends React.Component {

  static mapStateToProps = (state, props) => {
    return {
      me: getProfile(state)
    }
  }
  static mapDispatchToProps = { signOut }

  constructor(props) {
    super(props)
    this.signOut = this.signOut.bind(this)
  }

  componentDidMount() {
    // console.log(this);
  }

  async signOut() {
    let result = await this.props.signOut()
    if (result.success) {
      location.reload()
    } else {
      alert('退出失败')
    }
  }

  render() {

    const { me } = this.props

    return (<header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark bd-navbar">
        <NavLink className="navbar-brand" exact to="/">小度鱼后台管理</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">

            <li className="nav-item"><NavLink className="nav-link" exact to="/">首页</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/posts">帖子</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/topics">话题</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/peoples">用户</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/comments">评论</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/user-notifications">用户通知</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" exact to="/notifications">广播通知</NavLink></li>

          </ul>
          <span className="navbar-text">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">{me.nickname}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="javascript:void(0)" onClick={this.signOut}>退出</a>
              </li>
            </ul>
          </span>
        </div>
      </nav>
    </header>)
  }

}

// Head = CSSModules(Head, styles)

Head = connectReudx(Head)

export default Head
