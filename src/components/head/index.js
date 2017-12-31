import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class Head extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(<div className="flex-center">
        <div styleName="head" className="container-fluid">
        <NavLink exact to="/">小度鱼后台管理</NavLink>

        {/*
        <ul styleName="nav">
          <li><NavLink exact to="/">首页</NavLink></li>
          <li><NavLink exact to="/posts">帖子</NavLink></li>
          <li><NavLink exact to="/topics">话题</NavLink></li>
        </ul>
        */}

        </div>
      </div>
      )
  }

}

Head = CSSModules(Head, styles)

export default Head
